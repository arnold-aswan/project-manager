# Spaces

**Spaces** is a modern, collaborative task and project management platform. It provides a rich, responsive user experience for managing workspaces, projects, tasks, and teams — backed by a robust REST API for data management, authentication, and business logic.

---

## 🚀 Features

- **User Authentication**: Sign up, sign in, email verification, password reset.
- **Dashboard**: Overview of workspace stats, recent projects, upcoming tasks, and productivity analytics.
- **Workspaces**: Create, view, and manage multiple workspaces. Invite members, manage settings, transfer or delete workspaces.
- **Projects**: Create and manage projects within workspaces. View project details, progress, and associated tasks.
- **Tasks**: Create, assign, and track tasks. Kanban board, task details, status updates, priorities, comments, sub-tasks, and watchers.
- **Members**: View and manage workspace members, search/filter members, and invite new collaborators.
- **Settings**: Update workspace details, manage ownership, and perform administrative actions.
- **Archived Items**: View and restore archived projects and tasks.
- **User Profile**: Update profile information and change password.
- **Responsive UI**: Built with TailwindCSS and Shadcn UI for a modern, accessible experience.
- **API Integration**: Uses React Query and Axios for efficient data fetching and state management.
- **Docker Support**: Ready for containerized deployment.

---

## 🛠 Tech Stack

### Frontend

- React (React Router v7)
- TypeScript
- TailwindCSS
- Shadcn UI
- Zustand (state management)
- React Query (data fetching)
- Axios (HTTP client)
- Vite (build tool)

### Backend

- Node.js (TypeScript)
- Express (REST API)
- MongoDB (Mongoose)
- Zod (validation)
- JWT (authentication)
- SendGrid (email)
- dotenv, cors, morgan, cookie-parser (utilities)

---

## 🧩 Architecture & Logic Flow

### 1. Authentication

- **Frontend**: Forms for sign-up, login, email verification, and password reset.
- **Backend**: Handled via `/api-v1/auth` routes with JWT for session management.

### 2. Workspaces

- **Frontend**: Manage workspace lifecycle, members, and permissions.
- **Backend**: `/api-v1/workspaces` handles CRUD operations, invites, stats, and transfers.

### 3. Projects

- **Frontend**: Create/view/manage projects and their progress.
- **Backend**: `/api-v1/projects` manages creation, details, and archiving.

### 4. Tasks

- **Frontend**: Kanban boards, task assignment, comments, sub-tasks, priorities, etc.
- **Backend**: `/api-v1/tasks` for full task lifecycle and logs.

### 5. Members & Profile

- **Frontend**: View and manage workspace members, update user profile.
- **Backend**: `/api-v1/user` for profile and password management.

### 6. Data Flow

- REST API calls via **Axios** & **React Query**
- Routes protected by JWT
- Data validation enforced via **Zod** on both frontend and backend

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- `pnpm` (or `npm` / `yarn`)
- MongoDB instance (local or cloud)

---

## 📦 Backend Setup

````bash
cd backend
pnpm install


### Installation

Install dependencies:

```bash
pnpm install
# or
npm install
````

### Development

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

Create a production build:

```bash
pnpm build
# or
npm run build
```

### Project Structure

- `app/` - Main application code (routes, components, hooks, stores, types)
- `public/` - Static assets
- `components.json` - UI component registry
- `vite.config.ts` - Vite configuration
- `Dockerfile` - Docker build instructions

## Customization & Styling

- Uses [Tailwind CSS](https://tailwindcss.com/) for styling.
- Easily customizable via utility classes and configuration.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

---
