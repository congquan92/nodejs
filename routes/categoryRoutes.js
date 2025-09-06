const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// Tag routes (must be before /:id routes to avoid conflicts)
router.get('/tags', categoryController.getTags);
router.get('/tags/:id', categoryController.getTag);
router.post('/tags', protect, categoryController.createTag); // Only authenticated users can create tags

// Category routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', protect, categoryController.createCategory); // Only authenticated users can create categories

module.exports = router;
