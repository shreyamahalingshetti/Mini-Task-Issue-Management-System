# Mini Task & Issue Management System

A full-stack task management web application built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend. Tasks are organised on a Kanban-style board with drag-and-drop support, search/filter, and JWT-based authentication.

---

## Features

### Authentication
- Register and login with email + password
- JWT stored in `localStorage`, attached to every API request via Axios interceptor
- Protected routes — unauthenticated users are redirected to `/login`
- Split-screen auth layout (light-blue panel + white form panel)

### Task Board
- Three columns: **To Do**, **In Progress**, **Completed**
- Create, edit, and delete tasks via a modal form
- **Dual status-change mechanism** — both are perfectly in sync:
  - **Drag-and-drop** cards between columns (`@hello-pangea/dnd`)
  - **Status dropdown** directly on each card
- Optimistic UI updates with automatic rollback on API failure
- Search tasks by keyword (400 ms debounced)
- Filter tasks by priority (Low / Medium / High)
- Task count badges on each column header

### Task Fields
| Field | Details |
|---|---|
| Title | Required, min 3 characters |
| Description | Optional free text |
| Priority | Low / Medium / High (pastel colour-coded badges) |
| Status | To Do / In Progress / Completed |

### Design
- Clean light blue + white palette (`#2563EB` accent)
- **Lora** serif font for headings, **Inter** for body text (Google Fonts)
- Drag visual: card lifts with a blue shadow and 1.5° tilt
- Drop-zone highlight: dashed blue outline on hovered column
- Fully responsive — stacks vertically on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, `@hello-pangea/dnd` |
| Styling | Vanilla CSS (CSS custom properties) |
| HTTP client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |

---

## Project Structure

```
Mini task management/
├── client/                     # Vite + React frontend
│   └── src/
│       ├── api/
│       │   └── axios.js        # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── AuthLayout.jsx  # Split-screen wrapper for Login/Register
│       │   ├── Column.jsx      # Kanban column (Droppable)
│       │   ├── Navbar.jsx      # Top navigation bar
│       │   ├── SearchFilterBar.jsx
│       │   ├── TaskCard.jsx    # Individual task (Draggable)
│       │   └── TaskFormModal.jsx
│       ├── context/
│       │   └── AuthContext.jsx # Global auth state + login/logout helpers
│       ├── pages/
│       │   ├── Board.jsx       # Main Kanban board page
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── index.css           # Global design system (variables, components)
│       └── main.jsx
│
└── server/                     # Express REST API
    └── src/
        ├── config/
        │   └── db.js           # MongoDB connection
        ├── controllers/
        │   ├── authController.js
        │   └── taskController.js
        ├── middleware/
        │   ├── auth.js         # JWT protect middleware
        │   └── errorHandler.js
        ├── models/
        │   ├── User.js
        │   └── Task.js
        ├── routes/
        │   ├── authRoutes.js
        │   └── taskRoutes.js
        └── server.js
```

---

## API Reference

All task routes require a `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Login and receive a JWT |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports `?search=` and `?priority=`) |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Full update (title, description, priority) |
| `PATCH` | `/api/tasks/:id/status` | Update status only |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- A MongoDB connection URI (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1 — Clone the repository

```bash
git clone https://github.com/shreyamahalingshetti/Mini-Task-Issue-Management-System.git
cd "Mini-Task-Issue-Management-System"
```

### 2 — Configure environment variables

**Server** — create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskdb
JWT_SECRET=your_super_secret_key
```

**Client** — create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3 — Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4 — Run in development

Open **two terminals**:

```bash
# Terminal 1 — backend (runs on port 5000)
cd server
npm run dev

# Terminal 2 — frontend (runs on port 5173)
cd client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## How Drag-and-Drop and the Dropdown Stay in Sync

Both interactions call the **same** `changeTaskStatus(taskId, newStatus)` function in `Board.jsx`:

1. **Drag-and-drop** — `handleDragEnd` extracts `destination.droppableId` as the new status and calls `changeTaskStatus`.
2. **Status dropdown** — `onChange` on the `<select>` in `TaskCard` calls `onStatusChange`, which is the same `changeTaskStatus` from `Board`.

`changeTaskStatus` always:
- Saves previous state
- Applies the update optimistically (instant UI feedback)
- Sends `PATCH /tasks/:id/status` to the backend
- Reverts to the saved state on any API error

Because both paths go through one function and both read from the same React state, they are always in sync — changing status by drag updates the dropdown value on that card, and vice versa.

---

## License

MIT
