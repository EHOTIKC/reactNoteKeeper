import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './NoteItem.css';

function NoteItem({ _id, title, content, completed, onToggleCompleted, onNoteClick, isSelected }) {
  const navigate = useNavigate();
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const handleEditClick = () => {
    navigate(`/notes/${_id}`);
  };

  const handleCheckboxChange = () => {
    setAnimatingOut(true);
    setAnimationClass('fade-out-left');
  };

  useEffect(() => {
    if (animatingOut) {
      const timeout = setTimeout(() => {
        onToggleCompleted(_id, !completed);
        setAnimationClass('fade-in-right');
        setAnimatingOut(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [animatingOut]);

  // const getShortContent = () => {
  //   const tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = content;
  //   const textContent = tempDiv.textContent || tempDiv.innerText || '';
  //   return textContent.length > 100 ? textContent.slice(0, 100) + '...' : textContent || 'Немає вмісту';
  // };

  const getShortContent = () => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  const maxChars = 140;
  const short = textContent.slice(0, maxChars);

  return textContent.length > maxChars ? short + '...' : short || 'Немає вмісту';
};


  // Новий код для натискання та утримання
  let pressTimer = null;

  const handleMouseDown = () => {
    pressTimer = setTimeout(() => {
      onNoteClick && onNoteClick(_id, true);  // Довге натискання
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      if (onNoteClick) {
        onNoteClick(_id);  // Коротке натискання (якщо не було довгого)
      }
    }
  };

  return (
    <li
      className={`note ${completed ? 'completed-note' : ''} ${animationClass} ${isSelected ? 'selected' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <div className="note-header">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
          className="note-checkbox"
        />
        <h2>{title}</h2>
      </div>

      {/* <p>{getShortContent()}</p> */}
      <p className="note-content">{getShortContent()}</p>

      {!isSelected && (
        <button onClick={handleEditClick} className="edit-btn">Редагувати</button>
      )}
    </li>
  );
}

export default NoteItem;
