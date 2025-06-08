// src/components/EditNote.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function EditNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`);
        if (!res.ok) throw new Error('Не вдалося завантажити нотатку');
        const data = await res.json();
        setNote(data);
      } catch (err) {
        console.error('Помилка при завантаженні нотатки:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) return <p>Завантаження...</p>;
  if (!note) return <p>Нотатку не знайдено</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
}

export default EditNote;
