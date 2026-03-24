import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";
import { getTagColors } from "./Sidebar";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote, onSelect, isSelected } = props;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this note?')) {
      deleteNote(note._id);
      props.showAlert("Note deleted", "success");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    updateNote(note);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const tagColors = getTagColors(note.tag);

  return (
    <div
      className={`note-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(note)}
    >
      {/* Tag pill */}
      <span
        className="tag-pill"
        style={{ background: tagColors.bg, color: tagColors.text }}
      >
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: tagColors.dot,
          display: 'inline-block'
        }} />
        {note.tag || 'General'}
      </span>

      {/* Title */}
      <div className="note-card-title">
        {note.title.length > 60 ? note.title.substring(0, 60) + '…' : note.title}
      </div>

      {/* Preview */}
      <div className="note-card-preview">
        {note.description}
      </div>

      {/* Footer */}
      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.date)}</span>
        <div className="note-card-actions">
          <button className="note-card-action-btn" onClick={handleEdit} title="Edit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="note-card-action-btn delete" onClick={handleDelete} title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;