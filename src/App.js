import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [alert, setAlert] = useState(null);
  const [authKey, setAuthKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showAlert = (message, type) => {
    setAlert({ msg: message, type: type });
    setTimeout(() => setAlert(null), 3000);
  };

  const refreshAuthState = useCallback(() => {
    setAuthKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      setAuthKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="App" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', color: 'var(--color-text-muted)'
      }}>
        <span className="spinner-border me-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      <NoteState key={authKey} isAuthenticated={isAuthenticated}>
        <Router>
          <Alert alert={alert} />
          <Routes>
            {/* Auth pages — no navbar, full-screen split layout */}
            <Route
              path="/login"
              element={<Login showAlert={showAlert} refreshAuthState={refreshAuthState} />}
            />
            <Route
              path="/signup"
              element={<Signup showAlert={showAlert} refreshAuthState={refreshAuthState} />}
            />
            {/* App pages — navbar + content */}
            <Route
              path="/"
              element={
                <>
                  <Navbar refreshAuthState={refreshAuthState} />
                  <Home showAlert={showAlert} key={authKey} />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar refreshAuthState={refreshAuthState} />
                  <About />
                </>
              }
            />
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <>
                    <Navbar refreshAuthState={refreshAuthState} />
                    <Home showAlert={showAlert} key={authKey} />
                  </>
                ) : (
                  <Login showAlert={showAlert} refreshAuthState={refreshAuthState} />
                )
              }
            />
          </Routes>
        </Router>
      </NoteState>
    </div>
  );
}

export default App;