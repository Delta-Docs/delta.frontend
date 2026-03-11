# Delta.

## 1. Overview

Delta is an automated documentation system that ensures documentation remains consistent with the underlying codebase through continuous drift detection and updates. Its architecture is divided into a React/TypeScript frontend for user interaction and a Python backend responsible for analysis, processing, and documentation generation.

---

## 2. System Architecture

### 2.1 Technology Stack

#### 2.1.1 Frontend Service (`/frontend`)

- **Runtime Environment:** Node.js / Bun  
- **Core Framework:** React 18  
- **Language:** TypeScript 5.x  
- **Build System:** Vite 5.x  
- **Styling:** Tailwind CSS 3.x  

#### 2.1.2 Backend Service (`/backend`)

- **Runtime Environment:** Python 3.10+  
- **Web Framework:** FastAPI  
- **Server:** Uvicorn (ASGI)  
- **Database:** PostgreSQL  
- **ORM:** SQLAlchemy  
- **Migration Tool:** Alembic  

---

## 3. File Description

### 3.1 Frontend (`/frontend`)

- **src/app/**: Contains core application configuration, global providers, and routing setup.  
- **src/assets/**: Stores static assets such as images, fonts, and global CSS files.  
- **src/components/**: Houses all reusable UI components.
  - **shadcn/**: Implementation of the design system components (buttons, inputs, cards).
  - **landing/**: Components specific to the marketing landing page (Hero, About, Animations).
- **src/pages/**: Contains page components (Landing, Login, Signup) representing full views.  
- **src/hooks/**: Custom React hooks for sharing stateful logic (e.g., scroll handling, authentication).  
- **src/utils/**: Utility functions, constants, and helper classes.  

### 3.2 Backend (`/backend`)

- **app/**: The main application source code.  
  - **api/**: Defines API route handlers and endpoints.  
  - **core/**: Configuration settings (`config.py`) and security utilities (`security.py`).  
  - **db/**: Database connection management and session handling.  
  - **models/**: SQLAlchemy database models defining the schema (User, Repository, Drift).  
  - **schemas/**: Models used for data validation and serialization.  
  - **services/**: Business logic layer (GitHub API integration, Webhook processing).  
- **alembic/**: Database migration scripts and version history.  
- **tests/**: Unit and integration tests.  

---

## 4. Development Environment Setup

### 4.1 Prerequisites

Ensure the following tools are installed and configured in your environment path:

- **Node.js:** v18.0.0+ (or Bun v1.0.0+)  
- **Python:** v3.10+  
- **Git:** Latest stable version  

### 4.2 Installation & Execution

#### 4.2.1 Frontend Service

**Initialize:**

```bash
cd frontend
bun install  # Alternatives: npm install, yarn install
```

**Execute:**

```bash
bun dev
```
Access via: http://localhost:5173

#### 4.2.2 Backend Service

refer [link](https://github.com/Delta-Docs/delta.backend)

---

## 5. Troubleshooting

### 5.1 Frontend Issues

**Issue:** "Module not found" or import errors.<br/>
**Cause:** Missing dependencies or incorrect paths.<br/>
**Fix:** Run bun install again. Verify tsconfig.json path aliases (e.g., @/components).<br/>
<br/>
**Issue:** Port 5173 in use.<br/>
**Cause:** Another instance of the dev server is running.<br/>
**Fix:** Check other terminals. Vite usually auto-switches to the next available port (e.g., 5174).<br/>
<br/>

### 5.2 Backend Issues

**Issue:** ModuleNotFoundError: No module named fastapi <br/>
**Cause:** Dependencies are not installed in the current environment.<br/>
**Fix:** Ensure your virtual environment is active (.venv) and run `pip install -r requirements.txt`. <br/>
<br/>
**Issue:** uvicorn is not recognized <br/>
**Cause:** System path issue or venv not active.<br/>
**Fix:** Activate the venv. Alternatively, run `python -m uvicorn app.main:app --reload`.<br/>
<br/>
**Issue:** Database connection refused.<br/>
**Cause:** PostgreSQL service is down or credentials in .env are wrong.<br/>
**Fix:** Ensure Postgres is running. Check DATABASE_URL in .env.<br/>

**Issue:** "alembic: command not found"<br/>
**Cause:** Alembic not installed or not in path.<br/>
**Fix:** Ensure venv is active. Run `pip install alembic`. Use `python -m alembic upgrade head`.<br/>

## React + TypeScript + Vite

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
