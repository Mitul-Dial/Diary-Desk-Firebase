# Diary Desk

A minimal, personal note-taking web application inspired by the simplicity of Notion — built with React and Firebase.

## Overview

**Diary Desk** is a full-stack note-taking web application that allows users to create, organize, search, and manage personal notes in a clean, distraction-free interface. It features real-time cloud storage via Firebase Firestore, secure user authentication (Email/Password and Google OAuth), a tag-based organization system, and a system-aware dark mode — all wrapped in a Notion-inspired minimal UI.

This project demonstrates proficiency in modern front-end development, cloud-based backend integration, state management patterns, and responsive UI/UX design.

## Live Demo

[Open Diary Desk](https://diary-desk.web.app)

## Features

- **Authentication System**: Full user authentication powered by Firebase Auth. Includes Email and Password signup (with real-time password strength indicator and live match validation) and Google OAuth one-click sign-in.
- **Full CRUD Operations**: Complete Create, Read, Update, and Delete functionality for notes, all persisted in Cloud Firestore with strict per-user data isolation.
- **Tag-Based Organization**: Intuitive categorization using color-coded tags, a dedicated sidebar for quick navigation, and tag pills on each note.
- **Smart Search & Filtering**: Find any note instantly with multi-field search (title, description, tag) combined with live results counters.
- **Dark Mode**: System-aware theme toggle that automatically detects OS-level preference and persists user selection via localStorage.
- **Responsive Three-Panel Layout**: A productivity-focused layout featuring a collapsible sidebar, a scrollable notes grid, and a full-featured reading pane, adapting gracefully to mobile viewports.
- **Minimal UI**: A premium, custom design system utilizing CSS variables for cohesive styling, overlay modals, and smooth interactions without reliance on CSS frameworks.

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| React | Frontend UI Library |
| React Router | Client-Side Routing |
| Firebase Auth | Authentication Services |
| Firebase Firestore | NoSQL Cloud Database |
| Firebase Hosting | Web Application Deployment |
| Vanilla CSS | Custom Styling & Theming |

## Architecture

The application follows a client-serverless architecture utilizing Firebase for backend services:
- **Client**: A React Single Page Application (SPA) handling the user interface, routing, and global state management via the Context API.
- **Authentication**: Firebase Auth manages secure user sessions, credential validation, and OAuth flows.
- **Database**: Cloud Firestore acts as the real-time document database, securely storing user profiles and note data with explicit security rules based on authenticated UIDs.
- **Hosting**: The production build is deployed and served securely via Firebase Hosting.

## Project Structure

```text
Diary-Desk-Firebase/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── App.css
│   ├── App.js
│   ├── firebase.js
│   ├── index.css
│   └── index.js
├── .env.example
├── firebase.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v16.x or higher
- npm or yarn
- A Firebase project with Authentication and Firestore enabled

### Clone

```bash
git clone https://github.com/Mitul-Dial/Diary-Desk-Firebase.git
cd Diary-Desk-Firebase
```

### Install dependencies

```bash
npm install
```

### Configuration

Create a `.env` file in the project root with the following variables (see `.env.example`):

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Note: All variables must be prefixed with `REACT_APP_` to be accessible in the React application at build time.

### Run locally

```bash
npm start
```
The application will start and open at `http://localhost:3000`.

## Firebase Setup

Diary Desk utilizes the following Firebase services:
- **Authentication**: Ensure both Email/Password and Google Sign-In providers are enabled in the Firebase Console.
- **Firestore Database**: Create a Firestore database and deploy appropriate security rules to ensure per-user data isolation.
- **Hosting**: Used for deploying the production application.

## Screenshots

### Dashboard

<img width="1919" height="879" alt="Diary Desk Dashboard" src="https://github.com/user-attachments/assets/6d6ce119-729e-47ef-930b-ce93a7af38ba" />

### Notes View

<img width="1919" height="882" alt="Diary Desk Notes" src="https://github.com/user-attachments/assets/77751623-d39a-4257-a965-0260c0a1a823" />

### Note Editor

<img width="1919" height="887" alt="Diary Desk Editor" src="https://github.com/user-attachments/assets/ea28e218-dacc-47f5-aa1e-9a15ac7d0260" />

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

Made by Mitul Dial
