import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await addNote(note.title, note.description, note.tag);
      if (success !== false) {
        setNote({ title: "", description: "", tag: "" });
        props.showAlert("Note added", "success");
        if (props.onClose) props.onClose();
      } else {
        props.showAlert("Failed to add note", "danger");
      }
    } catch (error) {
      props.showAlert("Failed to add note", "danger");
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="edit-overlay" onClick={() => props.onClose && props.onClose()}>
      <div className="edit-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="edit-dialog-header">
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>New note</span>
          <button
            onClick={() => props.onClose && props.onClose()}
            style={{ color: 'var(--color-text-muted)', fontSize: 18, fontWeight: 300 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="edit-dialog-body">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text" className="form-input" name="title"
                value={note.title} onChange={onChange}
                placeholder="Note title" minLength={5} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-input" name="description"
                value={note.description} onChange={onChange}
                rows={8} minLength={5} required
                placeholder="Write your thoughts..."
                style={{ resize: 'vertical' }}
              />
              <div className="form-text">{note.description.length} characters</div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tag</label>
              <input
                type="text" className="form-input" name="tag"
                value={note.tag} onChange={onChange}
                placeholder="e.g. personal, work, ideas, journal"
              />
            </div>
          </div>

          <div className="edit-dialog-footer">
            <button type="button" className="btn btn-outline" onClick={() => props.onClose && props.onClose()}>
              Cancel
            </button>
            <button
              type="submit" className="btn btn-dark"
              disabled={note.title.length < 5 || note.description.length < 5}
            >
              Save note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNote;