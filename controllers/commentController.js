const commentModel = require('../model/commentModel');

async function getComments(req, res) {
  try {
    const postId = req.params.postId;
    const comments = await commentModel.getAllComments(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
}

async function getComment(req, res) {
  try {
    const comment = await commentModel.getCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comment', error: error.message });
  }
}

async function createComment(req, res) {
  try {
    const { content, parent_id } = req.body;
    const postId = req.params.postId;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const comment = await commentModel.createComment(req.user.id, postId, { content, parent_id });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
}

async function updateComment(req, res) {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const updated = await commentModel.updateComment(req.user.id, req.params.id, { content });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
}

async function deleteComment(req, res) {
  try {
    const result = await commentModel.deleteComment(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
}

async function updateCommentStatus(req, res) {
  try {
    const { status } = req.body;
    
    if (!['approved', 'pending', 'spam'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const result = await commentModel.updateCommentStatus(req.params.id, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment status', error: error.message });
  }
}

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  updateCommentStatus
};
