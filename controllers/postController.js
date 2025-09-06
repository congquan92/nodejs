const postModel = require('../model/postModel');

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

async function getPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;
    
    const result = await postModel.getAllPosts(page, limit, category, tag, search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
}

async function getPost(req, res) {
  try {
    const post = await postModel.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
}

async function getPostBySlug(req, res) {
  try {
    const post = await postModel.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
}

async function createPost(req, res) {
  try {
    const { title, content, excerpt, featured_image, status, category_id, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const slug = generateSlug(title);
    
    const post = await postModel.createPost(req.user.id, {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featured_image,
      status: status || 'draft',
      category_id,
      tags: tags || []
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
}

async function updatePost(req, res) {
  try {
    const { title, content, excerpt, featured_image, status, category_id, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const slug = generateSlug(title);
    
    const updated = await postModel.updatePost(req.user.id, req.params.id, {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featured_image,
      status: status || 'draft',
      category_id,
      tags: tags || []
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
}

async function deletePost(req, res) {
  try {
    const result = await postModel.deletePost(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
}

async function getPopularPosts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const posts = await postModel.getPopularPosts(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular posts', error: error.message });
  }
}

async function getRecentPosts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const posts = await postModel.getRecentPosts(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent posts', error: error.message });
  }
}

async function getMyPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await postModel.getPostsByUserId(req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
}

module.exports = { 
  getPosts, 
  getPost, 
  getPostBySlug,
  createPost, 
  updatePost, 
  deletePost,
  getPopularPosts,
  getRecentPosts,
  getMyPosts
};
