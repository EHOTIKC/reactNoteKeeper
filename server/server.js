require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const notesRouter = require("./routes/notes.js");
const authRouter = require("./routes/auth.js");
const Note = require("./models/Note");

const app = express();

app.use(cors());
app.use(express.json());

// API маршрути
app.use("/api/notes", notesRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Підключення до MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Підключено до MongoDB"))
  .catch((err) => console.error("❌ Помилка MongoDB:", err));

// Тестовий маршрут
app.get("/api/note", async (req, res) => {
  const note = await Note.findOne();
  if (!note) return res.status(404).json({ message: "Нотатка не знайдена" });
  res.json(note);
});

// // Підключення фронтенду для продакшн
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));

//   app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "../client/build", "index.html"));
//   });
// }
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}



app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порті ${PORT}`);
});
