import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const createPost = async (postData) => {
	const { data } = await axios.post('/api/posts', postData);
	return data;
};

export function useCreatePostMutation() {
	return useMutation({
		mutationFn: createPost,
	});
}

export const getAllPosts = async () => {
	const data = await axios.get('/api/posts/');
	return data;
};

export function usePostsQuery() {
	return useQuery({
		queryKey: ['posts'],
		queryFn: getAllPosts,
	});
}

export function useGetMyPostsQuery() {
	return useQuery({
		queryKey: ['myPosts'],
		queryFn: async () => {
			const data = axios.get('/api/posts/my-posts');
			return data;
		},
	});
}

export function useEditPostMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postData) => {
			const { data } = await axios.put(
				`/api/posts/${postData.postId}`,
				postData
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});
}

export function useDeletePostMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postId) => {
			const { data } = await axios.delete(`/api/posts/${postId}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});
}

export function useModeratePostMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ postId, action }) => {
			console.log('id: ', postId, 'action:', action);
			const { data } = await axios.patch(`/api/posts/${action}/${postId}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});
}
