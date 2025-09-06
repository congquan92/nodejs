const db = require('../config/db');

async function getAllComments(postId) {
  const [rows] = await db.query(`
    SELECT c.*, u.name as author FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.post_id = ? AND c.status = 'approved'
    ORDER BY c.created_at ASC
  `, [postId]);
  return rows;
}

async function getCommentById(id) {
  const [rows] = await db.query(`
    SELECT c.*, u.name as author FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = ?
  `, [id]);
  return rows[0];
}

async function createComment(userId, postId, { content, parent_id = null }) {
  const [result] = await db.query(
    'INSERT INTO comments (content, user_id, post_id, parent_id) VALUES (?, ?, ?, ?)',
    [content, userId, postId, parent_id]
  );
  return { id: result.insertId, content, user_id: userId, post_id: postId, parent_id };
}

async function updateComment(userId, commentId, { content }) {
  await db.query(
    'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
    [content, commentId, userId]
  );
  return { id: commentId, content, user_id: userId };
}

async function deleteComment(userId, commentId) {
  await db.query('DELETE FROM comments WHERE id = ? AND user_id = ?', [
    commentId,
    userId,
  ]);
  return { message: 'Comment deleted successfully' };
}

async function updateCommentStatus(commentId, status) {
  await db.query('UPDATE comments SET status = ? WHERE id = ?', [status, commentId]);
  return { message: 'Comment status updated successfully' };
}

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  updateCommentStatus
};
