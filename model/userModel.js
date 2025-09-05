const db = require('../config/db'); // Import the database connection
const bcrypt = require('bcryptjs');

async function createUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return { id: result.insertId, name, email };
}

async function findUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

module.exports = { createUser, findUserByEmail };
