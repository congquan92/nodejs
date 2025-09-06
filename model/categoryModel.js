const db = require('../config/db');

// Category functions
async function getAllCategories() {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
}

async function createCategory({ name, slug, description }) {
  const [result] = await db.query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name, slug, description]
  );
  return { id: result.insertId, name, slug, description };
}

// Tag functions
async function getAllTags() {
  const [rows] = await db.query('SELECT * FROM tags ORDER BY name');
  return rows;
}

async function getTagById(id) {
  const [rows] = await db.query('SELECT * FROM tags WHERE id = ?', [id]);
  return rows[0];
}

async function createTag({ name, slug }) {
  const [result] = await db.query(
    'INSERT INTO tags (name, slug) VALUES (?, ?)',
    [name, slug]
  );
  return { id: result.insertId, name, slug };
}

async function getTagsByPostId(postId) {
  const [rows] = await db.query(`
    SELECT t.* FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `, [postId]);
  return rows;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  getAllTags,
  getTagById,
  createTag,
  getTagsByPostId
};
