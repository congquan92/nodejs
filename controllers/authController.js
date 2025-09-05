const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { name, email, password } = req.body;
  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'email already exists' });
  }

  const newUser = await userModel.createUser({ name, email, password });
  res.status(201).json(newUser);
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Wrong email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Wrong email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
}

module.exports = { register, login };
