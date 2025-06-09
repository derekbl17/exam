const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/authMiddleware');
const {
	createComment,
	deleteComment,
	toggleLikeComment,
} = require('../controllers/commentController');

router.post('/:id', protect, createComment);
router.delete('/:id', protect, deleteComment);
router.patch('/:id/like', protect, toggleLikeComment);

module.exports = router;
