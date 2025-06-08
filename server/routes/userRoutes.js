// // routes/userRoutes.js
// const express = require('express');
// const User = require('../models/User');

// const router = express.Router();

// router.post('/api/users', async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     const saved = await newUser.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;
