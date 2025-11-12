# 📘 React NoteKeeper

> A fullstack note management application with authentication.  
> Built using **React**, **Node.js**, and **MongoDB**, with secure JWT-based user authentication.

---

## 🚀 Demo

 [https://reactnotekeeper.onrender.com/]

 *Demo account:*  
Email: `qwe`  
Password: `qwe`

---

## 🛠️ Technologies Used

### Frontend:
- React
- React Router DOM
- Vanilla CSS
- `fetch()` API for HTTP requests

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- cors

### Tooling & Dev:
concurrently – to run both frontend and backend together using a single npm run dev command

---

## ✨ Features

- User registration and login (JWT-based)
- Create, edit, delete notes
- Mark notes as completed
- Set deadlines for notes
- Notes are linked to the logged-in user
- Data stored in MongoDB database

---

## 📦 API Endpoints

### User:
- `POST   /api/users/register` – Register a new user
- `POST   /api/users/login` – Log in

### Notes:
- `GET    /api/notes` – Get user's notes
- `POST   /api/notes` – Create a new note
- `PUT    /api/notes/:id` – Update a note
- `DELETE /api/notes/:id` – Delete a note

> ⚠️ All `/api/notes` routes require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🧪 Running Locally

### 1. Clone the repository:
```bash
git clone https://github.com/EHOTIKC/reactNoteKeeper.git
cd reactNoteKeeper

2. Install dependencies:
Backend:

```bash
cd server
npm install

Frontend:
```bash
cd ../client
npm install

3. Create a .env file inside the server/ folder:
env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
4. Start the project:
npm run dev

The backend will be available at http://localhost:5000
The frontend will be available at http://localhost:3000



