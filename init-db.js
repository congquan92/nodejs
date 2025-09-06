const db = require('./config/db');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Test database connection
    await db.query('SELECT 1');
    console.log('✅ Database connection successful');

    // Check if tables exist and have data
    const [userRows] = await db.query('SELECT COUNT(*) as count FROM users');
    const [categoryRows] = await db.query('SELECT COUNT(*) as count FROM categories');
    const [tagRows] = await db.query('SELECT COUNT(*) as count FROM tags');

    console.log(`📊 Database statistics:
    - Users: ${userRows[0].count}
    - Categories: ${categoryRows[0].count}  
    - Tags: ${tagRows[0].count}`);

    // Create sample admin user if no users exist
    if (userRows[0].count === 0) {
      console.log('👤 Creating admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@blog.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created (email: admin@blog.com, password: admin123)');
    }

    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

initializeDatabase();
