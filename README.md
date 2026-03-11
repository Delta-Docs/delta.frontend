# ![Delta Logo](./public/logo.png) Delta

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

## 1. Overview

**Delta** is an intelligent, continuous documentation platform that treats documentation as a living part of your codebase. By integrating natively with your GitHub CI/CD workflow, Delta automatically detects drift between code changes and existing documentation during Pull Requests. Through the power of LLMs and autonomous LangGraph agents, Delta not only detects these inconsistencies but proactively proposes required documentation overhauls.

This repository (`delta.frontend`) holds the React dashboard that allows developers to manage their linked repositories, configure drift sensitivity, review AI-generated documentation updates, and monitor the overall health of their system. It works in lockstep with the Delta API (`delta.backend`).

## 2. Core Features

- **GitHub App Native Integration**: Securely authenticate via OAuth and trigger analysis strictly through GitHub Webhooks (`pull_request`, `check_suite`).
- **Real-time Drift Detection**: Analyze code diffs and traverse documentation trees simultaneously to highlight outdated contexts.
- **Intelligent Autorepair**: Generate detailed documentation update strategies utilizing state-of-the-art LLMs.
- **Interactive Developer Dashboard**: Manage repositories, tweak ignore patterns, and monitor documentation update pipelines all in one place.

## 3. System Architecture

Delta is decoupled into a high-performance interactive dashboard and an asynchronous, robust AI processing backend.

### 3.1 Technology Stack

#### Frontend Service
- **Framework:** React 18 (Vite 5.x)
- **Language:** TypeScript 5.x
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS 3.x with Shadcn UI

#### Backend Service (Delta API)
- **Framework:** FastAPI (Uvicorn / ASGI)
- **Language:** Python 3.10+
- **Database:** PostgreSQL (SQLAlchemy ORM + Alembic Migrations)
- **Asynchronous Processing:** Redis Queue (RQ) and LangGraph Workflow Agents

## 4. Project Structure

The platform organizes code logically across both repositories.

### Frontend (`/src/`)
```text
├── app/          # Core router configuration (React Router) and global Providers
├── assets/       # Static web assets and global CSS definitions
├── components/   # Reusable UI architecture
│   ├── dashboard/# Feature components for repository management and analytics
│   ├── landing/  # Marketing landing pages
│   └── shadcn/   # Accessible, low-level UI building blocks
├── hooks/        # Stateful UI abstractions and lifecycle handlers
├── pages/        # Top-level application route wrappers
└── utils/        # API configuration (Axios interceptors) and generic helpers
```

### Backend (`/app/`)
```text
├── agents/       # LangGraph multi-agent workflow definitions and LLM prompts
├── api.py / main.py # FastAPI entry points and route aggregation
├── core/         # Environment setup and security abstractions
├── db/           # SQLAlchemy session lifecycle management
├── models/       # Relational database table schemas
├── routers/      # Distinct REST API controllers (Auth, Repos, Notifications)
└── services/     # Core business logic (GitHub App authentication, Webhook parsing)
```

## 5. Local Development Guide

### 5.1 Prerequisites
You will need **Node.js v18.0.0+** (or **Bun**), **Python 3.10+**, **Docker** (for Postgres/Redis), and a **GitHub Account**.

### 5.2 Frontend Setup

1. **Clone & Install Dependencies:**
   ```bash
   git clone https://github.com/Delta-Docs/delta.frontend.git
   cd delta.frontend
   bun install  # or npm/yarn install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the frontend root:
   ```env
   VITE_API_URL="http://localhost:8000/api"
   VITE_GITHUB_CLIENT_ID="your_github_oauth_client_id"
   ```

3. **Start Development Server:**
   ```bash
   bun dev
   ```
   *Dashboard available at: `http://localhost:5173`*

### 5.3 Backend Setup

1. **Clone & Configure:**
   ```bash
   git clone https://github.com/Delta-Docs/delta.backend.git
   cd delta.backend
   cp .env.example .env # Configure Postgres, Redis, and GitHub App secrets
   ```

2. **Initialize Services & Database:**
   ```bash
   make setup # Creates .venv, installs dependencies, spins up Docker, and runs Alembic
   ```

3. **Run API Server:**
   ```bash
   make dev
   ```
   *API available at: `http://localhost:8000`*

## 6. REST API Reference

The React application fetches and mutates data via the FastAPI backend endpoints defined under `/api`. All protected endpoints expect a valid JWT Bearer Token in their Authorization header.

### 🔐 Authentication
| Method | Endpoint | Description | Payloads / Responses |
|--------|----------|-------------|----------------------|
| `POST` | `/api/auth/signup` | Register a new developer account. | Body: `{ email, password }` |
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT payload. | Res: `{ access_token, token_type }` |
| `POST` | `/api/auth/logout` | Terminate the active session. | |

### 📂 Repository Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/repos/` | Retrieve all GitHub repositories linked by the current user. |
| `PUT` | `/api/repos/{id}/settings` | Update configuration (target branches, file exclusions). |
| `PATCH`| `/api/repos/{id}/activate` | Toggle drift analysis tracking on or off. |
| `GET` | `/api/repos/{id}/drift-events` | Fetch historical drift events associated with a repository. |
| `GET` | `/api/repos/{id}/drift-events/{event_id}`| Retrieve granular AI analysis and diff insights for a specific Pull Request. |

### 🔔 Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhook/github` | The ingress point for all GitHub App Webhook payloads. |
| `GET` | `/api/dashboard/stats` | Provide aggregate analytics for the frontend dashboard timeline. |
| `GET` | `/api/notifications/` | Retrieve system alerts regarding drift events or integration failures. |

## 7. Troubleshooting

**Frontend Issues**
- `Port 5173 Address in use`: Vite will generally auto-switch to 5174. If it fails, explicitly terminate previous Node instances or run `bun dev --port 3000`.
- `Network Error on Login`: Verify `VITE_API_URL` exactly matches the running uvicorn instance without a trailing slash, and ensure `CORS_ORIGINS` in your backend `.env` accepts `http://localhost:5173`.

**Backend Issues**
- `Database connection refused`: Ensure your Docker containers are running (`make docker-up`) and that `POSTGRES_CONNECTION_URL` matches your local config.
- `alembic: command not found`: Your Python virtual environment is not active. Run `source .venv/bin/activate` or use the Makefile abstractions.
- `No module named fastapi`: Run `make install` to ensure pip requirements have successfully resolved inside `.venv`.
