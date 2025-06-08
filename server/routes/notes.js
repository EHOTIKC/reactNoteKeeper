// routes/notes.js
const mongoose = require('mongoose');



const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');


const authenticateToken = require('../middleware/auth.js'); // 👈 Додаємо middleware для аутентифікації


// // Отримати всі нотатки

router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const authorIdRaw = req.user._id || req.user.id;
    if (!authorIdRaw) {
      return res.status(400).json({ message: 'Користувач не знайдений у токені' });
    }

    // Викликаємо ObjectId з new
    const authorId = new mongoose.Types.ObjectId(authorIdRaw);

    const notes = await Note.find({ authorId });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Серверна помилка' });
  }
});



// Отримати нотатку за ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Нотатка не знайдена' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні нотатки' });
  }
});



router.post('/', auth, async (req, res) => {
  try {
    const { title, content, completed, deadline } = req.body; // Не включаємо authorId із body
    const note = new Note({
      title: title || '',
      content: content || '',
      completed: completed || false,
      deadline: deadline || null,
      authorId: req.user.userId // 👈 Беремо authorId з токена користувача
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні нотатки' });
  }
});



router.put('/:id', async (req, res) => {
  try {
    const { title, content, completed, deadline, authorId } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        completed,
        deadline,
        authorId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Нотатка не знайдена' });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error('Помилка при оновленні нотатки:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});



// Віддаємо нотатку у вигляді JSON
router.get('/edit/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).send('Нотатку не знайдено');
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).send('Помилка сервера');
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Нотатка не знайдена' });
    res.json({ message: 'Нотатка видалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
