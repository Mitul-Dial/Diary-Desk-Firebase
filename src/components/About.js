import React from "react";

const About = () => {
  const features = [
    { emoji: '📝', title: 'Create & edit', desc: 'Capture notes with a clean, distraction-free editor' },
    { emoji: '🔍', title: 'Smart search', desc: 'Find any note instantly by title, content, or tag' },
    { emoji: '🏷️', title: 'Tag system', desc: 'Organize with color-coded tags and categories' },
    { emoji: '🌙', title: 'Dark mode', desc: 'Switch between light and dark for comfortable viewing' },
    { emoji: '📱', title: 'Responsive', desc: 'Works beautifully on any screen size' },
    { emoji: '🔒', title: 'Secure', desc: 'Firebase authentication and Firestore security rules' },
  ];

  return (
    <div style={{
      flex: 1,
      overflow: 'auto',
      background: 'var(--color-background)',
      padding: 'var(--spacing-3xl) var(--spacing-xl)'
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 500,
            letterSpacing: '-0.3px',
            color: 'var(--color-text)',
            marginBottom: 8
          }}>
            About Diary Desk
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            maxWidth: 480
          }}>
            A minimal, personal note-taking app inspired by the simplicity of Notion.
            Capture thoughts, organize ideas, and keep your journal — all in one place.
          </p>
        </div>

        {/* Features grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-3xl)'
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: 'var(--spacing-lg)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)'
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{f.emoji}</div>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                color: 'var(--color-text)',
                marginBottom: 4
              }}>
                {f.title}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div style={{
          padding: 'var(--spacing-xl)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-surface)',
          marginBottom: 'var(--spacing-3xl)'
        }}>
          <h2 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            color: 'var(--color-text)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Built with
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-lg)'
          }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)', marginBottom: 8 }}>
                Frontend
              </div>
              {['React 18', 'Custom CSS', 'React Router'].map(t => (
                <div key={t} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  · {t}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)', marginBottom: 8 }}>
                Backend
              </div>
              {['Firebase Auth', 'Cloud Firestore', 'Security Rules'].map(t => (
                <div key={t} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  · {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          paddingBottom: 'var(--spacing-2xl)',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)'
        }}>
          Diary Desk v2.0 — Made by Mitul Dial
        </div>
      </div>
    </div>
  );
};

export default About;