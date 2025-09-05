const jwt = require('jsonwebtoken');
require('dotenv').config();

function protect(req, res, next) {
  const authHeader = req.headers['authorization'];// lay token tu nguoi dung
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: 1, email: "..." }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}
module.exports = { protect };