const db = require('../config/db');

async function getAllPosts(page = 1, limit = 10, category = null, tag = null, search = null) {
  const offset = (page - 1) * limit;
  let query = `
    SELECT p.*, u.name as author, c.name as category_name, c.slug as category_slug,
           (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 'approved') as comment_count
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
  `;
  const params = [];

  if (category) {
    query += ' AND c.slug = ?';
    params.push(category);
  }

  if (tag) {
    query += ' AND p.id IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.slug = ?)';
    params.push(tag);
  }

  if (search) {
    query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  
  // Get total count for pagination
  let countQuery = 'SELECT COUNT(*) as total FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = "published"';
  const countParams = [];
  
  if (category) {
    countQuery += ' AND c.slug = ?';
    countParams.push(category);
  }

  if (tag) {
    countQuery += ' AND p.id IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.slug = ?)';
    countParams.push(tag);
  }

  if (search) {
    countQuery += ' AND (p.title LIKE ? OR p.content LIKE ?)';
    countParams.push(`%${search}%`, `%${search}%`);
  }

  const [countRows] = await db.query(countQuery, countParams);
  const total = countRows[0].total;

  return {
    posts: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}

async function getPostById(id) {
  const [rows] = await db.query(`
    SELECT p.*, u.name as author, u.email as author_email, c.name as category_name, c.slug as category_slug
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.id = ?
  `, [id]);
  
  if (rows[0]) {
    // Get tags for this post
    const [tagRows] = await db.query(`
      SELECT t.* FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `, [id]);
    
    rows[0].tags = tagRows;
    
    // Increment view count
    await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
  }
  
  return rows[0];
}

async function getPostBySlug(slug) {
  const [rows] = await db.query(`
    SELECT p.*, u.name as author, u.email as author_email, c.name as category_name, c.slug as category_slug
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.slug = ? AND p.status = 'published'
  `, [slug]);
  
  if (rows[0]) {
    // Get tags for this post
    const [tagRows] = await db.query(`
      SELECT t.* FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `, [rows[0].id]);
    
    rows[0].tags = tagRows;
    
    // Increment view count
    await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [rows[0].id]);
  }
  
  return rows[0];
}

async function createPost(userId, { title, slug, content, excerpt, featured_image, status = 'draft', category_id, tags = [] }) {
  const [result] = await db.query(
    'INSERT INTO posts (title, slug, content, excerpt, featured_image, status, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, slug, content, excerpt, featured_image, status, userId, category_id]
  );
  
  const postId = result.insertId;
  
  // Add tags if provided
  if (tags && tags.length > 0) {
    for (const tagId of tags) {
      await db.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
    }
  }
  
  return { id: postId, title, slug, content, excerpt, featured_image, status, user_id: userId, category_id, tags };
}

async function updatePost(userId, postId, { title, slug, content, excerpt, featured_image, status, category_id, tags = [] }) {
  await db.query(
    'UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, status = ?, category_id = ? WHERE id = ? AND user_id = ?',
    [title, slug, content, excerpt, featured_image, status, category_id, postId, userId]
  );
  
  // Update tags - first remove existing tags
  await db.query('DELETE FROM post_tags WHERE post_id = ?', [postId]);
  
  // Add new tags
  if (tags && tags.length > 0) {
    for (const tagId of tags) {
      await db.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
    }
  }
  
  return { id: postId, title, slug, content, excerpt, featured_image, status, user_id: userId, category_id, tags };
}

async function deletePost(userId, postId) {
  await db.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [
    postId,
    userId,
  ]);
  return { message: 'Post deleted successfully' };
}

async function getPopularPosts(limit = 5) {
  const [rows] = await db.query(`
    SELECT p.*, u.name as author, c.name as category_name
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
    ORDER BY p.views DESC, p.created_at DESC
    LIMIT ?
  `, [limit]);
  return rows;
}

async function getRecentPosts(limit = 5) {
  const [rows] = await db.query(`
    SELECT p.*, u.name as author, c.name as category_name
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT ?
  `, [limit]);
  return rows;
}

async function getPostsByUserId(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(`
    SELECT p.*, u.name as author, c.name as category_name
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `, [userId, limit, offset]);
  
  const [countRows] = await db.query('SELECT COUNT(*) as total FROM posts WHERE user_id = ?', [userId]);
  const total = countRows[0].total;

  return {
    posts: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getPopularPosts,
  getRecentPosts,
  getPostsByUserId
};
