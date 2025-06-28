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

  function prepareContentForDisplay(rawHtml) {
    const container = document.createElement('div');
    container.innerHTML = rawHtml;

    // Знайти всі input[type="checkbox"] та видалити
    container.querySelectorAll('input[type="checkbox"]').forEach((input) => input.remove());

    // Знайти всі li, які мали б class "checked" (якщо чекбокс був відмічений)
    container.querySelectorAll('li').forEach((li) => {
      // Якщо li містить input checkbox checked, було б клас 'checked'
      // Але оскільки input видалений, перевіримо через атрибут checked (альтернативно — залишай клас)
      // Тут припустимо, що клас 'checked' лишається
      if (li.classList.contains('checked')) {
        li.style.textDecoration = 'line-through';
        li.style.color = 'gray';
      }
    });

    return container.innerHTML;
  }


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


      <div
        className="note-content"
        dangerouslySetInnerHTML={{ __html: prepareContentForDisplay(content) }}
      ></div>



      {!isSelected && (
        <button onClick={handleEditClick} className="edit-btn">Редагувати</button>
      )}
    </li>
  );
}

export default NoteItem;
