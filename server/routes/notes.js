
// routes/notes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authenticateToken = require('../middleware/auth.js'); // middleware аутентифікації
const Note = require('../models/Note');

// --- Отримати всі нотатки користувача ---
router.get('/', authenticateToken, async (req, res) => {
  try {
    const authorId = req.user._id; // беремо авторизаційний id з токена
    if (!authorId) return res.status(400).json({ message: 'Користувач не знайдений у токені' });

    const notes = await Note.find({ authorId }).sort({ createdAt: -1 }); // новіші вгорі
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Серверна помилка' });
  }
});

// --- Отримати нотатку для редагування ---
router.get('/edit/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Нотатку не знайдено' });

    // Перевірка, що нотатка належить користувачу
    if (note.authorId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// --- Отримати нотатку за ID ---
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Нотатку не знайдено' });

    // Перевірка авторства
    if (note.authorId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// --- Створити нотатку ---
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, completed, deadline } = req.body;

    const note = new Note({
      title: title || '',
      content: content || '',
      completed: completed || false,
      deadline: deadline || null,
      authorId: req.user._id // беремо id користувача з токена
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при створенні нотатки' });
  }
});

// --- Оновити нотатку ---
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, completed, deadline } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Нотатку не знайдено' });

    // Перевірка авторства
    if (note.authorId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.completed = completed ?? note.completed;
    note.deadline = deadline ?? note.deadline;
    note.updatedAt = new Date();

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при оновленні нотатки' });
  }
});

// --- Видалити нотатку ---
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Нотатку не знайдено' });

    // Перевірка авторства
    if (note.authorId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Нотатку видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при видаленні нотатки' });
  }
});

module.exports = router;
