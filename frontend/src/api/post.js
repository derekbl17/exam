import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const URL='https://exam-pnbu.onrender.com/api/posts'

export const createPost = async (postData) => {
	const { data } = await axios.post(`${URL}`, postData);
	return data;
};

export function useCreatePostMutation() {
	return useMutation({
		mutationFn: createPost,
	});
}

export const getAllPosts = async () => {
	const data = await axios.get(`${URL}/`);
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
			const data = axios.get(`${URL}/my-posts`);
			return data;
		},
	});
}

export function useEditPostMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postData) => {
			const { data } = await axios.put(
				`${URL}/${postData.postId}`,
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
			const { data } = await axios.delete(`${URL}/${postId}`);
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
			const { data } = await axios.patch(`${URL}/${action}/${postId}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});
}
