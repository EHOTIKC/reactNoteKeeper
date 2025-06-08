import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import './Note.css';

function Note() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotes } = useOutletContext(); // отримуємо setNotes з Layout через OutletContext

  const [note, setNote] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`);
        if (!res.ok) throw new Error('Нотатку не знайдено');
        const data = await res.json();
        setNote(data);
        setNewTitle(data.title);
        editorRef.current.innerHTML = data.content || '';
      } catch (err) {
        console.error('Помилка при завантаженні нотатки:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  // Функція для оновлення списку нотаток з сервера
  const refreshNotes = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Помилка при оновленні списку нотаток:', err);
    }
  };

  const handleSave = async () => {
    try {
      const newContent = editorRef.current.innerHTML;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        const updatedNote = await res.json();
        console.log('Оновлено:', updatedNote);
        await refreshNotes();  // Оновлюємо список нотаток
        navigate('/');
      } else {
        const errorData = await res.json();
        console.error('Помилка при оновленні нотатки:', errorData.message);
      }
    } catch (err) {
      console.error('Помилка при відправці PUT-запиту:', err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Ви впевнені, що хочете видалити нотатку?');
    if (!confirmed) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        console.log('Нотатку видалено');
        await refreshNotes(); // Оновлюємо список нотаток після видалення
        navigate('/');
      } else {
        const errorData = await res.json();
        console.error('Помилка при видаленні нотатки:', errorData.message);
      }
    } catch (err) {
      console.error('Помилка при видаленні нотатки:', err);
    }
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="note-edit-page">
      <h2>Редагування нотатки</h2>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Заголовок"
        className="note-input"
      />
      <div className="format-buttons">
        <button onClick={() => applyFormat('bold')}><b>B</b></button>
        <button onClick={() => applyFormat('italic')}><i>I</i></button>
        <button onClick={() => applyFormat('underline')}><u>U</u></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="note-editor"
        style={{
          minHeight: '200px',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px'
        }}
      ></div>
      <button onClick={handleSave} className="save-btn">Зберегти</button>
      <button onClick={handleDelete} className="delete-btn">Видалити</button>
    </div>
  );
}

export default Note;
