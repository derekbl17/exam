const express = require('express');
const router = express.Router();
const {
	activatePost,
	closePost,
	getPosts,
	postPost,
	putPost,
	deletePost,
	getOwnPosts,
} = require('../controllers/postController.js');
const { protect, adminProtect } = require('../middleware/authMiddleware.js');

router.route('/').get(getPosts).post(protect, postPost);
router.route('/:id').put(protect, putPost).delete(protect, deletePost);
router.get('/my-posts', protect, getOwnPosts);
router.patch('/active/:id', protect, adminProtect, activatePost);
router.patch('/close/:id', protect, adminProtect, closePost);

module.exports = router;
