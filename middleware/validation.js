// Validation middleware for blog posts
function validatePost(req, res, next) {
  const { title, content } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  } else if (title.trim().length > 255) {
    errors.push('Title must be less than 255 characters');
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  } else if (content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }

  if (req.body.status && !['draft', 'published'].includes(req.body.status)) {
    errors.push('Status must be either "draft" or "published"');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

// Validation middleware for user registration
function validateRegistration(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

// Validation middleware for login
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

// Validation middleware for comments
function validateComment(req, res, next) {
  const { content } = req.body;
  const errors = [];

  if (!content || content.trim().length === 0) {
    errors.push('Comment content is required');
  } else if (content.trim().length < 3) {
    errors.push('Comment must be at least 3 characters long');
  } else if (content.trim().length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
}

module.exports = {
  validatePost,
  validateRegistration,
  validateLogin,
  validateComment
};
