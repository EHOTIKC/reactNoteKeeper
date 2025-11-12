import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import './Note.css';

function Note() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotes } = useOutletContext();

  const [note, setNote] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!loading && editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [loading]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`);
        if (!res.ok) throw new Error('Нотатку не знайдено');
        const data = await res.json();
        setNote(data);
        setNewTitle(data.title);
        setContent(data.content || '');
      } catch (err) {
        console.error('Помилка при завантаженні нотатки:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content }),
      });
      if (res.ok) {
        const updatedNote = await res.json();
        console.log('Оновлено:', updatedNote);
        await refreshNotes();
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
        await refreshNotes();
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
    setContent(editorRef.current.innerHTML);
  };

const makeChecklist = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const editor = editorRef.current;
  if (!editor.contains(selection.anchorNode)) return;

  const range = selection.getRangeAt(0);
  let selectedNode = selection.anchorNode;

  if (selectedNode.nodeType === Node.TEXT_NODE) {
    selectedNode = selectedNode.parentElement;
  }

  const existingChecklist = selectedNode.closest('ul.checklist');
  if (existingChecklist) {
    const listItems = existingChecklist.querySelectorAll('li');
    const fragment = document.createDocumentFragment();

    listItems.forEach((li, index) => {
      const textNode = document.createTextNode(li.textContent.trim());
      fragment.appendChild(textNode);
      if (index < listItems.length - 1) fragment.appendChild(document.createElement('br'));
    });

    existingChecklist.parentNode.replaceChild(fragment, existingChecklist);
    setContent(editor.innerHTML);
    return;
  }

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const lines = selectedText.split(/\n|<br\s*\/?>/).filter(line => line.trim() !== '');
  const listItems = lines.map(
    line => `<li><input type="checkbox" onclick="this.parentNode.classList.toggle('checked')"> ${line.trim()}</li>`
  );

  const checklistHtml = `<ul class="checklist">${listItems.join('')}</ul>`;
  range.deleteContents();

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = checklistHtml;
  const frag = document.createDocumentFragment();
  while (tempDiv.firstChild) frag.appendChild(tempDiv.firstChild);

  range.insertNode(frag);
  setContent(editor.innerHTML);
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
        <button onClick={makeChecklist}>Список</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="note-editor"
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}
      ></div>
      <button onClick={handleSave} className="save-btn">Зберегти</button>
      <button onClick={handleDelete} className="delete-btn">Видалити</button>
    </div>
  );
}

export default Note;
