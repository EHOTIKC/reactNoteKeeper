// // src/components/EmptyNote.jsx
import React from 'react';

function EmptyNote({ onAdd }) {
    const handleAdd = async () => {
        try {
            const token = localStorage.getItem("token"); // Отримуємо токен
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Додаємо заголовок авторизації
                },
                body: JSON.stringify({ title: '', content: '' }),
            });
            if (!res.ok) {
                throw new Error('Failed to add note');
            }
            const newNote = await res.json();
            onAdd(newNote);
        } catch (err) {
            console.error('Error adding note:', err);
        }
    };

    return (
        <li className="EmptyNote">
            <button className='add-notes' onClick={handleAdd}>+</button>
        </li>
    );
}

export default EmptyNote;
