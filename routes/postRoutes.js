const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
// muon tao, sua, xoa bai viet phai dang nhap
router.post('/', protect, postController.createPost);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;
