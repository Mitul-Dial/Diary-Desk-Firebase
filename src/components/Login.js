import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const googleProvider = new GoogleAuthProvider();

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      props.showAlert("Logged in successfully", "success");
      if (props.refreshAuthState) props.refreshAuthState();
      navigate("/", { replace: true });
    } catch (error) {
      let errorMessage = "Invalid credentials";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Please try to login with correct credentials";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      props.showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create user doc in Firestore if it doesn't exist yet
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "",
          email: user.email || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      props.showAlert("Logged in with Google", "success");
      if (props.refreshAuthState) props.refreshAuthState();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        // user closed the popup, no alert needed
      } else {
        props.showAlert("Google sign-in failed. Please try again.", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );

  return (
    <div className="auth-layout">
      {/* Left dark panel */}
      <div className="auth-dark-panel">
        <div style={{ textAlign: 'center' }}>
          {/* Logo */}
          <img
            src="/favicon-32x32.png"
            alt="Diary Desk"
            style={{
              width: 40, height: 40,
              borderRadius: 8,
              filter: 'invert(1)',
              margin: '0 auto 16px',
              display: 'block'
            }}
          />
          <div style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '-0.3px',
            marginBottom: 12
          }}>
            Diary Desk
          </div>
          <div style={{
            color: '#6B6B6B',
            fontSize: '14px',
            fontStyle: 'italic',
            fontFamily: "'Lora', Georgia, serif"
          }}>
            Your thoughts, organized.
          </div>
        </div>

        {/* Decorative dots */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: 8
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">Sign in to your journal</p>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'var(--color-surface)',
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              color: 'var(--color-text)',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              marginBottom: 24,
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-muted)'; e.currentTarget.style.background = 'var(--color-background)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)'; }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 24, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)'
          }}>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border)' }} />
            or
            <div style={{ flex: 1, height: '0.5px', background: 'var(--color-border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading || !credentials.email || !credentials.password}
            >
              {loading ? (
                <>
                  <span className="spinner-border me-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;