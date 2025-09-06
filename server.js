const express = require('express');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler = require('./middleware/errorHandel');
const pool = require('./config/db');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Blog API is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js Blog API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (POST /register, POST /login)',
      posts: '/api/posts (GET, POST, PUT, DELETE)',
      categories: '/api/categories (GET, POST)',
      tags: '/api/tags (GET, POST)',
      comments: '/api/posts/:postId/comments (GET, POST, PUT, DELETE)',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found', status: 404 });
});

// Start server
pool.getConnection().then((connection) => {
  console.log('Connected to MySQL database');
  app.listen(port, () => {
    console.log(`🚀 Blog server running on port ${port}`);
    console.log(`📖 API Documentation available at: http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to MySQL database:', error);
});