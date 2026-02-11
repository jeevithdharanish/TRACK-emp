# Employee Performance Tracker — Frontend

A modern single-page application built with **React 19**, **Vite 6**, and **Tailwind CSS 4** for managing and visualizing employee performance data.

---

## Tech Stack

| Category       | Technology                       |
|----------------|----------------------------------|
| Framework      | React 19                         |
| Build Tool     | Vite 6                           |
| Styling        | Tailwind CSS 4                   |
| Routing        | React Router DOM 7               |
| HTTP Client    | Axios 1.7                        |
| Charts         | Recharts 2.15                    |
| Notifications  | React Hot Toast 2.5              |
| Icons          | React Icons 5.4                  |

---

## Project Structure

```
Frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   └── Layout.jsx       # Sidebar + main layout wrapper
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── pages/
│   │   ├── Dashboard.jsx     # Overview with charts & stats
│   │   ├── Employees.jsx     # Employee listing
│   │   ├── EmployeeDetail.jsx# Single employee view
│   │   ├── EmployeeForm.jsx  # Create / edit employee
│   │   ├── Evaluations.jsx   # Performance evaluations list
│   │   ├── EvaluationForm.jsx# Create / edit evaluation
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Reports.jsx       # Performance reports & charts
│   │   ├── Roles.jsx         # Role management
│   │   └── SkillLevelStages.jsx # Skill level stage management
│   ├── services/
│   │   └── api.js            # Axios instance & API functions
│   ├── App.jsx               # Route definitions
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
└── vite.config.js
```

---

## Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- Backend server running on `http://localhost:8080`

---

## Getting Started

```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app runs at **http://localhost:5173**.

---

## Available Scripts

| Command           | Description                       |
|--------------------|-----------------------------------|
| `npm run dev`      | Start dev server with hot reload  |
| `npm run build`    | Build for production              |
| `npm run preview`  | Preview the production build      |

---

## Features

- **Authentication** — Login & registration with JWT token management
- **Dashboard** — Overview of key metrics and performance charts
- **Employee Management** — CRUD operations for employees with pagination
- **Performance Evaluations** — Create, view, and manage evaluations with date filtering
- **Role Management** — Define and manage organizational roles
- **Skill Level Stages** — Configure skill progression stages
- **Reports** — Visualize top performers, department performance, and trends using interactive charts

---

## API Proxy

The Vite dev server proxies all `/api` requests to the backend:

```js
// vite.config.js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

No CORS configuration is needed during development.

---

## Authentication Flow

1. User logs in via `/login` → receives a JWT token
2. Token is stored in `localStorage`
3. Every API request includes the token in the `Authorization` header
4. On `401` response, the user is automatically redirected to the login page

---

## Building for Production

```bash
npm run build
```

Output is generated in the `dist/` folder. Serve it with any static file server or deploy to a hosting platform.

---

## Environment Configuration

The app connects to the backend via the Vite proxy in development. For production, configure the API base URL as needed in `src/services/api.js` or through environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```
