const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { validatePost } = require('../middleware/validation');

// Specific routes first (to avoid parameter conflicts)
router.get('/popular', postController.getPopularPosts);
router.get('/recent', postController.getRecentPosts);
router.get('/my/posts', protect, postController.getMyPosts);
router.get('/slug/:slug', postController.getPostBySlug);

// General routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

// Protected routes - require authentication
router.post('/', protect, validatePost, postController.createPost);
router.put('/:id', protect, validatePost, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;
