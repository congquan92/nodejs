const db = require('../config/db');

async function getAllPosts() {
  const [rows] = await db.query(
    'SELECT p.*, u.name as author FROM posts p JOIN users u ON p.user_id = u.id'
  );
  return rows;
}

async function getPostById(id) {
  const [rows] = await db.query(
    'SELECT p.*, u.name as author FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
    [id]
  );
  return rows[0];
}

async function createPost(userId, { title, content }) {
  const [result] = await db.query(
    'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, userId]
  );
  return { id: result.insertId, title, content, user_id: userId };
}

async function updatePost(userId, postId, { title, content }) {
  await db.query(
    'UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?',
    [title, content, postId, userId]
  );
  return { id: postId, title, content, user_id: userId };
}

async function deletePost(userId, postId) {
  await db.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [
    postId,
    userId,
  ]);
  return { message: 'Post deleted successfully' };
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
