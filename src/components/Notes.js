import React, { useContext, useEffect, useState, useCallback } from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import NoteDetail from "./NoteDetail";
import Sidebar from "./Sidebar";
import { auth } from "../firebase";

const MOBILE_BP = 1024;

const Notes = (props) => {
    const context = useContext(noteContext);
    const navigate = useNavigate();
    const { notes, getNotes, editNote, deleteNote, isLoading, isAuthenticated } = context;

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [activeView, setActiveView] = useState("all");
    const [selectedNote, setSelectedNote] = useState(null);
    const [showAddNote, setShowAddNote] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

    const { sidebarOpen, onCloseSidebar } = props;

    // Determine if currently mobile
    const isMobile = useCallback(() => window.innerWidth <= MOBILE_BP, []);

    useEffect(() => {
        if (auth.currentUser && isAuthenticated) {
            getNotes();
        } else if (!auth.currentUser) {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

    // Close mobile detail when resizing to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > MOBILE_BP) setMobileDetailOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Edit note modal
    const [editForm, setEditForm] = useState({ id: "", etitle: "", edescription: "", etag: "" });

    const openEditForm = (note) => {
        setEditForm({
            id: note._id,
            etitle: note.title,
            edescription: note.description,
            etag: note.tag || ""
        });
        setEditingNote(note);
        // close mobile detail when opening edit dialog
        setMobileDetailOpen(false);
    };

    const handleEditSave = () => {
        editNote(editForm.id, editForm.etitle, editForm.edescription, editForm.etag);
        setEditingNote(null);
        // Update selected note view
        if (selectedNote && selectedNote._id === editForm.id) {
            setSelectedNote({
                ...selectedNote,
                title: editForm.etitle,
                description: editForm.edescription,
                tag: editForm.etag
            });
        }
        props.showAlert("Note updated", "success");
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this note?')) {
            deleteNote(id);
            if (selectedNote && selectedNote._id === id) {
                setSelectedNote(null);
                setMobileDetailOpen(false);
            }
            props.showAlert("Note deleted", "success");
        }
    };

    const onEditFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    // Select a note — on mobile, open the detail overlay
    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        if (isMobile()) {
            setMobileDetailOpen(true);
        }
    };

    // Filtering
    const notesArray = Array.isArray(notes) ? notes : [];
    const filteredNotes = notesArray.filter(note => {
        const matchesSearch = !searchTerm ||
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (note.tag && note.tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTag = !selectedTag || note.tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    if (isLoading) {
        return (
            <div className="app-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)' }}>
                    <span className="spinner-border me-2" />
                    Loading notes...
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="app-layout">
                {/* Sidebar overlay for mobile */}
                {sidebarOpen && (
                    <div className="sidebar-overlay" onClick={onCloseSidebar}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Sidebar
                                notes={notesArray}
                                selectedTag={selectedTag}
                                onTagSelect={setSelectedTag}
                                onNewNote={() => setShowAddNote(true)}
                                activeView={activeView}
                                onViewChange={setActiveView}
                                onClose={onCloseSidebar}
                            />
                        </div>
                    </div>
                )}

                {/* Panel 1 — Sidebar (desktop only, hidden at ≤1024px via CSS) */}
                <Sidebar
                    notes={notesArray}
                    selectedTag={selectedTag}
                    onTagSelect={setSelectedTag}
                    onNewNote={() => setShowAddNote(true)}
                    activeView={activeView}
                    onViewChange={setActiveView}
                />

                {/* Panel 2 — Notes Grid */}
                <div className="notes-panel">
                    <div className="notes-panel-header">
                        <input
                            type="text"
                            className="notes-search"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="notes-meta-row">
                            <span className="notes-count">
                                {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
                                {selectedTag && ` · ${selectedTag}`}
                            </span>
                            {selectedTag && (
                                <button
                                    onClick={() => setSelectedTag('')}
                                    style={{
                                        fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="notes-grid">
                        {filteredNotes.length === 0 ? (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: 'var(--spacing-3xl) var(--spacing-xl)',
                                color: 'var(--color-text-muted)'
                            }}>
                                <div style={{ fontSize: 32, opacity: 0.3, marginBottom: 'var(--spacing-md)' }}>📝</div>
                                <div style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                                    {notesArray.length === 0 ? 'No notes yet' : 'No notes match your search'}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)' }}>
                                    {notesArray.length === 0
                                        ? 'Create your first note to get started'
                                        : 'Try adjusting your search or filters'}
                                </div>
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <Noteitem
                                    key={note._id}
                                    note={note}
                                    updateNote={openEditForm}
                                    showAlert={props.showAlert}
                                    onSelect={handleNoteSelect}
                                    isSelected={selectedNote && selectedNote._id === note._id}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Panel 3 — Detail (desktop only, hidden at ≤1024px via CSS) */}
                <NoteDetail
                    note={selectedNote}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                />
            </div>

            {/* Mobile detail overlay — visible on small screens when a note is selected */}
            {mobileDetailOpen && selectedNote && (
                <div className="detail-overlay active" onClick={() => setMobileDetailOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <button
                            className="detail-close-btn"
                            onClick={() => setMobileDetailOpen(false)}
                            style={{ display: 'flex' }}
                        >
                            ✕
                        </button>
                        <NoteDetail
                            note={selectedNote}
                            onEdit={openEditForm}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            )}

            {/* FAB — New Note (mobile, visible via CSS at ≤1024px) */}
            <button className="mobile-fab" onClick={() => setShowAddNote(true)}>＋</button>

            {/* Add Note overlay */}
            {showAddNote && (
                <AddNote
                    showAlert={props.showAlert}
                    onClose={() => setShowAddNote(false)}
                />
            )}

            {/* Edit Note overlay */}
            {editingNote && (
                <div className="edit-overlay" onClick={() => setEditingNote(null)}>
                    <div className="edit-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="edit-dialog-header">
                            <span style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>Edit note</span>
                            <button
                                onClick={() => setEditingNote(null)}
                                style={{ color: 'var(--color-text-muted)', fontSize: 18, fontWeight: 300 }}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="edit-dialog-body">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text" className="form-input" name="etitle"
                                    value={editForm.etitle} onChange={onEditFormChange} minLength={5}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Content</label>
                                <textarea
                                    className="form-input" name="edescription"
                                    value={editForm.edescription} onChange={onEditFormChange}
                                    rows={8} minLength={5}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Tag</label>
                                <input
                                    type="text" className="form-input" name="etag"
                                    value={editForm.etag} onChange={onEditFormChange}
                                    placeholder="e.g. personal, work, ideas"
                                />
                            </div>
                        </div>
                        <div className="edit-dialog-footer">
                            <button className="btn btn-outline" onClick={() => setEditingNote(null)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-dark"
                                onClick={handleEditSave}
                                disabled={editForm.etitle.length < 5 || editForm.edescription.length < 5}
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Notes;
