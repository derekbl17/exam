import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateCommentMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ postId, content }) => {
			const data = await axios.post(`/api/comments/${postId}`, { content });
			return data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
		onError: (error) => {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Failed to delete comment';
			console.error('Delete error:', errorMessage);
		},
	});
}

export function useDeleteCommentMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (commentId) => {
			const res = await axios.delete(`/api/comments/${commentId}`);
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});
}

export function useLikeCommentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId) => {
			const response = await axios.patch(`/api/comments/${postId}/like`);
			return {
				postId,
				...response.data,
			};
		},

		onError: (err) => {
			toast.error(err.response?.data?.message || 'Like action failed');
		},

		onSuccess: () => {
			queryClient.invalidateQueries(['comments']);
		},
	});
}
