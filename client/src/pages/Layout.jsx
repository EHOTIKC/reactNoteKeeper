import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("token", "some_token");
    window.dispatchEvent(new Event("login"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    window.addEventListener("login", checkLogin);
    window.addEventListener("logout", checkLogin);

    return () => {
      window.removeEventListener("login", checkLogin);
      window.removeEventListener("logout", checkLogin);
    };
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error('Помилка при отриманні нотаток:', err);
      }
    };
    fetchNotes();
  }, []);

  const handleSelectionChange = (newSelectedIds) => {
    setSelectedIds(newSelectedIds);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map(id =>
          fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        )
      );

      alert('Обрані нотатки видалено!');

      // ✅ Локально фільтруємо без повторного fetch
      setNotes(prevNotes => prevNotes.filter(note => !selectedIds.includes(note._id)));

      setSelectedIds([]);
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  };

  return (
    <div className="layout-container">
      <header className="header">
        <Link to="/" className="logo-link">
          <h1>NoteKeeper</h1>
        </Link>

        {selectedIds.length > 0 && (
          <div className="selection-buttons">
            <button onClick={handleClearSelection}>Скасувати</button>
            <button onClick={handleDeleteSelected}>Видалити</button>
          </div>
        )}

        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout}>Вийти</button>
          ) : (
            <Link to="/login"><button>Увійти</button></Link>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet context={{ selectedIds, handleSelectionChange, notes, setNotes }} />
      </main>

      <footer className="footer">
        <p>© 2025 NoteKeeper. Всі права захищені.</p>
      </footer>
    </div>
  );
}

export default Layout;
