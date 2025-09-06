const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validateComment } = require('../middleware/validation');

// Comment routes for specific post (must be more specific routes first)
router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', protect, validateComment, commentController.createComment);

// Individual comment operations (these should have different endpoint structure)
router.get('/comment/:id', commentController.getComment);
router.put('/comment/:id', protect, validateComment, commentController.updateComment);
router.delete('/comment/:id', protect, commentController.deleteComment);
router.patch('/comment/:id/status', protect, commentController.updateCommentStatus);

module.exports = router;
