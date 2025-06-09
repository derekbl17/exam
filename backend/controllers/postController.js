const asyncHandler = require('express-async-handler');

const Post = require('../models/postModel');

const getPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find()
		.populate('author', 'name')
		.populate({
			path: 'comments',
			populate: {
				path: 'author',
				select: 'name',
			},
		})
		.lean();
	res.status(200).json(posts);
});

const getOwnPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find({ author: req.user.userId })
		.populate('author', 'name')
		.populate({
			path: 'comments',
			populate: {
				path: 'author',
				select: 'name',
			},
		})
		.lean();
	res.status(200).json(posts);
});

const activatePost = asyncHandler(async (req, res) => {
	console.log('activating');
	const post = await Post.findById(req.params.id);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	const update = {
		status: 'active',
		updatedAt: new Date(),
	};
	const updatedPost = await Post.findByIdAndUpdate(req.params.id, update);
	res.status(200).json(updatedPost);
});

const closePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	const update = {
		status: 'closed',
		updatedAt: new Date(),
	};
	const updatedPost = await Post.findByIdAndUpdate(req.params.id, update);
	res.status(200).json(updatedPost);
});

const postPost = asyncHandler(async (req, res) => {
	const { title, content } = req.body;

	if (!title || !content) {
		res.status(400);
		throw new Error('title or body missing');
	}

	const post = await Post.create({
		title,
		content,
		author: req.user.userId, // Automatically set from authenticated user
	});
	res.status(200).json(post);
});
// put => overwrite whole existing target. Patch only changes specific values of target
const putPost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		res.status(400);
		throw new Error('Post not found');
	}
	if (
		post.author.toString() === req.user.userId.toString() ||
		req.user.role === 'admin'
	) {
		const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.status(200).json(updatedPost);
	} else {
		res.status(403);
		throw new Error('Not authorized to edit this post');
	}
});

const deletePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		res.status(400);
		throw new Error('Post not found');
	}
	if (
		post.author.toString() === req.user.userId.toString() ||
		req.user.role === 'admin'
	) {
		await Post.findByIdAndDelete(req.params.id);
		res.status(200).json({ id: req.params.id });
	} else {
		res.status(403);
		throw new Error('Not authorized to delete this post');
	}
});

module.exports = {
	getPosts,
	postPost,
	putPost,
	deletePost,
	getOwnPosts,
	activatePost,
	closePost,
};
