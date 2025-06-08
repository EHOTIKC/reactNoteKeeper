import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import EmptyNote from '../components/EmptyNote';
import NoteItem from '../components/NoteItem';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const { selectedIds, handleSelectionChange, notes, setNotes } =
    useOutletContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');


    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        } else {
          console.error('Помилка при отриманні нотаток');
          setNotes([]);
        }
      } catch (err) {
        console.error('Помилка при отриманні нотаток:', err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [setNotes, navigate]);

  const handleAddNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleToggleCompleted = async (id, newCompletedStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notes/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed: newCompletedStatus }),
        }
      );

      if (res.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === id ? { ...note, completed: newCompletedStatus } : note
          )
        );
      } else {
        console.error('Помилка при оновленні completed');
      }
    } catch (err) {
      console.error('Помилка PUT для completed:', err);
    }
  };

  const sortNotes = (notes) => {
    return [...notes].sort((a, b) => {
      const aHasContent = a.content?.trim().length > 0;
      const bHasContent = b.content?.trim().length > 0;
      if (aHasContent !== bHasContent) return aHasContent ? -1 : 1;
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const updatedDiff = new Date(b.updatedAt) - new Date(a.updatedAt);
      if (updatedDiff !== 0) return updatedDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const sortedNotes = sortNotes(notes);

  const handleNoteClick = (id, longPress = false) => {
    if (longPress || selectedIds.length > 0) {
      const isSelected = selectedIds.includes(id);
      const newSelectedIds = isSelected
        ? selectedIds.filter((noteId) => noteId !== id)
        : [...selectedIds, id];
      handleSelectionChange(newSelectedIds);
    }
  };

  return (
    <>
      {loading ? (
        <p>Завантаження нотаток...</p>
      ) : (
        <div className="notes-scroll-container">
          <div className="notes-grid">
            {sortedNotes.length === 0 ? (
              <p>Нотаток немає</p>
            ) : (
              sortedNotes.map((note) => (
                <NoteItem
                  key={note._id}
                  _id={note._id}
                  title={note.title}
                  content={note.content}
                  completed={note.completed}
                  createdAt={note.createdAt}
                  onToggleCompleted={handleToggleCompleted}
                  onNoteClick={handleNoteClick}
                  isSelected={selectedIds.includes(note._id)}
                />
              ))
            )}
            <EmptyNote onAdd={handleAddNote} />
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
