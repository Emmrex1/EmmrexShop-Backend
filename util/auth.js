
const jwt = require('jsonwebtoken');
function generateToken(user) {
  return jwt.sign(
    { id: user._id},
    process.env.JWT_SECRET,
    { expiresIn: '1h' } 
  );
}
function authenticateToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user; 
    next(); 
  });
}


module.exports = {
  generateToken,
  authenticateToken,

};



