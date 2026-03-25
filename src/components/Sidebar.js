import React from "react";

const TAG_COLORS = {
    personal: { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED' },
    work: { bg: '#DBEAFE', text: '#1E40AF', dot: '#2563EB' },
    ideas: { bg: '#DCFCE7', text: '#166534', dot: '#16A34A' },
    journal: { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
    health: { bg: '#FFE4E6', text: '#9F1239', dot: '#E11D48' },
};

const DEFAULT_TAG = { bg: '#F3F4F6', text: '#4B5563', dot: '#6B7280' };

export const getTagColors = (tag) => {
    if (!tag) return DEFAULT_TAG;
    const key = tag.toLowerCase().trim();
    return TAG_COLORS[key] || DEFAULT_TAG;
};

const Sidebar = ({ notes, selectedTag, onTagSelect, onNewNote, activeView, onViewChange, onClose }) => {
    const notesArray = Array.isArray(notes) ? notes : [];

    // Collect tags with counts
    const tagCounts = {};
    notesArray.forEach(note => {
        const tag = (note.tag || 'General').trim();
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const tags = Object.entries(tagCounts).sort((a, b) => a[0].localeCompare(b[0]));

    const handleNavClick = (cb) => {
        cb();
        if (onClose) onClose();
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src="/favicon-32x32.png" alt="Diary Desk" style={{ width: 26, height: 26, borderRadius: 6 }} />
                <span className="sidebar-wordmark">Diary Desk</span>
            </div>

            <nav className="sidebar-nav">
                {/* Navigation */}
                <button
                    className={`sidebar-item ${activeView === 'all' && !selectedTag ? 'active' : ''}`}
                    onClick={() => handleNavClick(() => { onViewChange('all'); onTagSelect(''); })}
                >
                    <span className="sidebar-item-icon">📝</span>
                    <span>All Notes</span>
                    <span className="sidebar-count">{notesArray.length}</span>
                </button>

                {/* Tags Section */}
                <div className="sidebar-section-title">Tags</div>
                {tags.map(([tag, count]) => {
                    const colors = getTagColors(tag);
                    return (
                        <button
                            key={tag}
                            className={`sidebar-item ${selectedTag === tag ? 'active' : ''}`}
                            onClick={() => handleNavClick(() => onTagSelect(selectedTag === tag ? '' : tag))}
                        >
                            <span
                                className="sidebar-tag-dot"
                                style={{ backgroundColor: colors.dot }}
                            />
                            <span>{tag}</span>
                            <span className="sidebar-count">{count}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-new-btn" onClick={() => handleNavClick(onNewNote)}>
                    ＋ New Note
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
