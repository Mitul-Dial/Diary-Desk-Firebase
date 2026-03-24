import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = ({ refreshAuthState, onNewNote }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (refreshAuthState) refreshAuthState();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/favicon-32x32.png" alt="Diary Desk" style={{ width: 22, height: 22, borderRadius: 4 }} />
          <span style={{
            fontSize: 'var(--text-md)',
            fontWeight: 500,
            color: 'var(--color-text)',
            letterSpacing: '-0.2px'
          }}>
            Diary Desk
          </span>
        </Link>
      </div>

      <div className="navbar-right">
        <DarkModeToggle />

        {isLoggedIn ? (
          <>
            <Link
              to="/about"
              className="navbar-btn"
              style={{
                color: location.pathname === '/about' ? 'var(--color-text)' : undefined
              }}
            >
              About
            </Link>

            {onNewNote && location.pathname === '/' && (
              <button className="navbar-btn navbar-btn-dark" onClick={onNewNote}>
                ＋ New Note
              </button>
            )}

            <button className="navbar-btn" onClick={handleLogout} style={{ color: 'var(--color-error)' }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-btn">
              Log in
            </Link>
            <Link to="/signup" className="navbar-btn navbar-btn-dark">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;