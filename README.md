<p align="center">
  <img src="public/banner.png" alt="Diary Desk Banner" width="600" />
</p>

<div align="center">

# ✏️ Diary Desk

**Capture. Organize. Reflect.**

A minimal, personal note-taking web application inspired by the simplicity of Notion — built with React and Firebase.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features In-Depth](#-features-in-depth)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [What I Learned](#-what-i-learned)
- [License](#-license)

---

## 🧭 Overview

**Diary Desk** is a full-stack note-taking web application that allows users to create, organize, search, and manage personal notes in a clean, distraction-free interface. It features real-time cloud storage via Firebase Firestore, secure user authentication (Email/Password + Google OAuth), a tag-based organization system, and a beautiful dark mode — all wrapped in a Notion-inspired minimal UI.

This project was built to demonstrate proficiency in modern front-end development, cloud-based backend integration, state management patterns, and responsive UI/UX design.

---

## ✨ Features In-Depth

### 🔐 Authentication System
Full user authentication powered by **Firebase Auth** with two sign-in methods:
- **Email & Password**: Users can register with their email and a password. The signup form includes a **real-time password strength indicator** (weak → strong, visualized with a 4-segment color bar) and **live password-match validation** with visual feedback (✓ green / ✕ red).
- **Google OAuth Sign-In**: One-click sign-in via Google popup. On first sign-in, a user profile document is automatically created in Firestore using `setDoc` with `serverTimestamp`.
- **Error Handling**: Specific, user-friendly error messages for common scenarios — invalid credentials, email already in use, too many attempts, weak password, and popup closed by user.
- **Auth State Persistence**: Uses Firebase's `onAuthStateChanged` listener to maintain session state across page refreshes and detect login/logout events in real time.

### 📝 Full CRUD Operations
Complete Create, Read, Update, and Delete functionality for notes, all persisted in **Cloud Firestore**:
- **Create**: Notes are saved with a title, description, tag, user ID, and server-generated timestamps. New notes are immediately added to the local state for an optimistic, instant-feeling UI.
- **Read**: Notes are fetched using a Firestore `query` filtered by the authenticated user's UID (`where("userId", "==", uid)`), ensuring strict **per-user data isolation**. Notes are sorted client-side by date (newest first).
- **Update**: Notes can be edited via an overlay modal dialog. The `updatedAt` timestamp is refreshed on each edit using `serverTimestamp`.
- **Delete**: Notes are removed from both Firestore and local state with a confirmation prompt to prevent accidental loss.

### 🏷️ Tag-Based Organization
An intuitive tagging system to categorize and filter notes:
- **Color-Coded Tags**: Built-in color palettes for common tags (Personal → purple, Work → blue, Ideas → green, Journal → amber, Health → rose). Unknown tags gracefully fallback to a neutral gray.
- **Sidebar Navigation**: A dedicated sidebar dynamically lists all tags with their note counts. Clicking a tag instantly filters the notes panel.
- **Tag Pills**: Each note card displays its tag as a styled pill with a colored dot indicator, ensuring quick visual identification.

### 🔍 Smart Search & Filtering
Find any note instantly:
- **Multi-Field Search**: The search bar filters notes by matching against the title, description content, and tag simultaneously.
- **Combined Filtering**: Search and tag filters work together — apply a tag filter from the sidebar and then narrow results with a text search.
- **Live Results Count**: A real-time counter shows how many notes match the current filters (e.g., "5 notes · Work").

### 🌙 Dark Mode
A system-aware theme toggle for comfortable viewing in any lighting:
- **Automatic Detection**: On first visit, the app respects the user's OS-level preference via `window.matchMedia('(prefers-color-scheme: dark)')`.
- **Manual Toggle**: Users can switch themes via a sun/moon icon button in the navbar. Custom SVG icons — no external icon library required.
- **Persistence**: The user's theme preference is saved to `localStorage` and restored on every visit.
- **CSS Custom Properties**: The entire theme is driven by CSS variables (`--color-background`, `--color-text`, `--color-surface`, etc.), enabling a seamless and flicker-free transition with the `data-theme` attribute on `<html>`.

### 📱 Responsive Three-Panel Layout
A productivity-focused layout inspired by professional note-taking apps:
- **Panel 1 — Sidebar**: Collapsible tag navigation and quick actions.
- **Panel 2 — Notes Grid**: A scrollable grid of note cards with search and filtering.
- **Panel 3 — Detail View**: A reading pane that displays the full content of the selected note.
- Fully responsive — adapts gracefully from desktop to mobile viewports using CSS custom properties and flexible layouts.

### 🎨 Notion-Inspired Minimal UI
A premium, distraction-free interface:
- **Split-Screen Auth Pages**: Login and signup feature a dark-panel + form-panel layout with the app logo, tagline, and decorative elements.
- **Custom Design System**: All styling uses a hand-crafted CSS design system with custom properties for spacing (`--spacing-*`), typography (`--text-*`), radii (`--radius-*`), and colors — no CSS frameworks.
- **Smooth Interactions**: Hover effects, transitions, loading spinners, and focus states for a polished user experience.
- **Overlay Modals**: Note creation and editing use overlay dialogs with form validation (minimum 5 characters for title and content).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Why I Chose It |
|---|---|---|
| **UI Library** | React 19 | Component-based architecture, hooks for state management, fast virtual DOM |
| **Routing** | React Router v7 | Declarative client-side routing with protected routes and navigation |
| **State Management** | React Context API | Global state for notes without the complexity of Redux — used a custom `NoteState` provider |
| **Authentication** | Firebase Auth | Secure, production-ready auth with email/password and Google OAuth out of the box |
| **Database** | Cloud Firestore | Real-time NoSQL document database with per-user security rules |
| **Styling** | Custom CSS | Full control over the design system using CSS custom properties, no framework dependency |
| **Build Tool** | Create React App | Zero-config React setup with hot reloading, environment variable support (`REACT_APP_*`) |
| **Deployment** | Firebase Hosting *(optional)* | Seamless deployment pipeline with the Firebase CLI |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Navbar   │  │ Sidebar  │  │   Notes Panel     │  │
│  │ DarkMode  │  │ Tag Nav  │  │ Search + Grid +   │  │
│  │  Toggle   │  │          │  │   Detail View     │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│            ↕ React Context (NoteState) ↕             │
├─────────────────────────────────────────────────────┤
│                  Firebase SDK (v12)                   │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Firebase Auth    │  │   Cloud Firestore        │  │
│  │  • Email/Password │  │   • notes collection     │  │
│  │  • Google OAuth   │  │   • users collection     │  │
│  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Diary-Desk-Firebase/
├── public/                     # Static assets
│   ├── index.html              # HTML template with meta tags
│   ├── favicon.ico             # App favicon
│   └── manifest.json           # PWA manifest
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Top navigation bar with logout & theme toggle
│   │   ├── Sidebar.js          # Tag-based sidebar navigation
│   │   ├── Notes.js            # Main notes panel with search & grid
│   │   ├── Noteitem.js         # Individual note card component
│   │   ├── NoteDetail.js       # Full note detail reading pane
│   │   ├── AddNote.js          # Note creation overlay modal
│   │   ├── Login.js            # Login page (Email + Google)
│   │   ├── Signup.js           # Registration with strength meter
│   │   ├── DarkModeToggle.js   # Theme switcher with SVG icons
│   │   ├── Alert.js            # Toast-style alert notifications
│   │   ├── About.js            # About page with feature grid
│   │   └── Home.js             # Home wrapper component
│   ├── context/
│   │   └── notes/
│   │       ├── noteContext.js   # React Context definition
│   │       └── NoteState.js     # Context provider with Firestore CRUD
│   ├── firebase.js              # Firebase config (uses env variables)
│   ├── App.js                   # Root component with routing & auth listener
│   ├── App.css                  # Main stylesheet & design system
│   └── index.js                 # React DOM entry point
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Template for environment variables
├── .gitignore                   # Git ignore rules
└── package.json                 # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16.x or higher
- **npm** or **yarn**
- A **Firebase project** with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Diary-Desk-Firebase.git
   cd Diary-Desk-Firebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example file and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables (see `.env.example`):

| Variable | Description |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` | Your Firebase project API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Auth domain (e.g., `your-app.firebaseapp.com`) |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Storage bucket URL |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID |

> **Note:** All variables must be prefixed with `REACT_APP_` to be accessible in the React app at build time. This is a Create React App convention.

---

## 📸 Screenshots

*(Add your screenshots here)*

---

## 🧠 What I Learned

Building Diary Desk strengthened my skills across the full stack:

- **React Hooks & Patterns**: Leveraged `useState`, `useEffect`, `useContext`, `useCallback`, and `useNavigate` for clean, functional component architecture.
- **Firebase Integration**: Worked with Firebase Auth (email + OAuth), Firestore queries with `where` clauses, `serverTimestamp`, and real-time auth state listeners.
- **State Management**: Implemented a custom Context API provider (`NoteState`) to manage global state — a practical alternative to Redux for medium-scale apps.
- **Security Best Practices**: Moved API keys to environment variables, added comprehensive `.gitignore` patterns, and implemented per-user data isolation in Firestore.
- **UI/UX Design**: Created a design system from scratch using CSS custom properties, delivering a cohesive, theme-able, and responsive interface without any CSS framework.
- **Error Handling**: Built robust error handling for async Firebase operations with user-friendly feedback messages.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Made with ❤️ by <b>Mitul Dial</b></sub>
</div>
