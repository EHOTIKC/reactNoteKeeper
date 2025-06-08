// // controllers/userController.js
// exports.register = async (req, res) => {
//   const { nickname, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ nickname });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Користувач з таким нікнеймом вже існує' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ nickname, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.status(201).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Помилка сервера' });
//   }
// };
