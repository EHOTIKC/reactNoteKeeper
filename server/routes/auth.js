// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || !password) return res.status(400).json({ message: 'Введіть nickname та пароль' });

    const existingUser = await User.findOne({ nickname });
    if (existingUser) return res.status(400).json({ message: 'Такий nickname вже існує' });

    const user = new User({ nickname, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Логін
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || !password) return res.status(400).json({ message: 'Введіть nickname та пароль' });

    const user = await User.findOne({ nickname });
    if (!user) return res.status(400).json({ message: 'Користувач не знайдений' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Невірний пароль' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;
