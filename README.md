# Delta Frontend

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
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

## 4. Project Structure

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
## 5. Local Development Guide

### 5.1 Prerequisites
You will need **Node.js v18.0.0+** (or **Bun**), **Docker** and a **GitHub Account**.

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


## 7. Troubleshooting

**Frontend Issues**
- `Port 5173 Address in use`: Vite will generally auto-switch to 5174. If it fails, explicitly terminate previous Node instances or run `bun dev --port 3000`.
- `Network Error on Login`: Verify `VITE_API_URL` exactly matches the running uvicorn instance without a trailing slash, and ensure `CORS_ORIGINS` in your backend `.env` accepts `http://localhost:5173`.

**Backend Issues**
- `Database connection refused`: Ensure your Docker containers are running (`make docker-up`) and that `POSTGRES_CONNECTION_URL` matches your local config.
- `alembic: command not found`: Your Python virtual environment is not active. Run `source .venv/bin/activate` or use the Makefile abstractions.
- `No module named fastapi`: Run `make install` to ensure pip requirements have successfully resolved inside `.venv`.
