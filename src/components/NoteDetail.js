import React from "react";
import { getTagColors } from "./Sidebar";

const NoteDetail = ({ note, onEdit, onDelete }) => {
    if (!note) {
        return (
            <div className="detail-panel">
                <div className="detail-empty">
                    <div className="detail-empty-icon">📄</div>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>No note selected</div>
                    <div style={{ fontSize: 'var(--text-sm)' }}>
                        Click a note to view its contents
                    </div>
                </div>
            </div>
        );
    }

    const tagColors = getTagColors(note.tag);

    const formatFullDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getReadTime = (text) => {
        if (!text) return '< 1 min';
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return minutes <= 1 ? '1 min read' : `${minutes} min read`;
    };

    return (
        <div className="detail-panel">
            <div className="detail-header">
                <span
                    className="tag-pill"
                    style={{
                        background: tagColors.bg,
                        color: tagColors.text,
                        marginBottom: 'var(--spacing-md)'
                    }}
                >
                    <span style={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: tagColors.dot,
                        display: 'inline-block'
                    }} />
                    {note.tag || 'General'}
                </span>
                <div className="detail-title">{note.title}</div>
                <div className="detail-meta">
                    <span>{formatFullDate(note.date)}</span>
                    <span>·</span>
                    <span>{getReadTime(note.description)}</span>
                </div>
            </div>

            <div className="detail-body">
                {note.description}
            </div>

            <div className="detail-footer">
                <button className="btn btn-dark" onClick={() => onEdit(note)}>
                    Edit
                </button>
                <button className="btn btn-outline-danger" onClick={() => onDelete(note._id)}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default NoteDetail;
