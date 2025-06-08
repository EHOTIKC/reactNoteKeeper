require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRouter = require('./routes/notes.js');
const authRouter = require('./routes/auth.js'); // 👈 Додаємо маршрут авторизації

const Note = require('./models/Note');

const app = express();

app.use(cors());
app.use(express.json());

// Підключаємо маршрути
app.use('/api/notes', notesRouter);
app.use('/api/auth', authRouter); // 👈 Додаємо підключення до auth

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Підключено до MongoDB'))
  .catch((err) => console.error('❌ Помилка MongoDB:', err));

app.get('/api/note', async (req, res) => {
  const note = await Note.findOne();
  if (!note) return res.status(404).json({ message: 'Нотатка не знайдена' });
  res.json(note);
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порті ${PORT}`);
});
