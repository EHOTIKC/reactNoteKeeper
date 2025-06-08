// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Перетворюємо userId на _id для уніфікації
    req.user = {
      _id: user.userId,
      ...user // додаємо інші поля payload, якщо вони є
    };

    next();
  });
}

module.exports = authenticateToken;


