
import './style/Notes.css';
import './style/EmptyNote.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import Note from "./pages/Note";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes/:id" element={<Note />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
