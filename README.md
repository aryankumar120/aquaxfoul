# Aqua-X-Foul Maritime Biofouling Management Platform
> **Cleaner Vessels. Greener Oceans.**  
> Web-based maritime vessel management, hydrodynamic drag monitoring, and biofouling intelligence dashboard.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites & System Requirements](#prerequisites--system-requirements)
3. [Quick Start (Fast Setup)](#quick-start-fast-setup)
4. [Step-by-Step Installation Guide](#step-by-step-installation-guide)
   - [Step 1: Database Setup (PostgreSQL)](#step-1-database-setup-postgresql)
   - [Step 2: Backend Setup (FastAPI)](#step-2-backend-setup-fastapi)
   - [Step 3: Frontend Setup (React + Vite)](#step-3-frontend-setup-react--vite)
5. [Running the Application](#running-the-application)
6. [Accessing Services & Documentation](#accessing-services--documentation)
7. [Excel Data Ingestion Pipeline](#excel-data-ingestion-pipeline)
8. [Running Automated Tests](#running-automated-tests)
9. [Project Directory Structure](#project-directory-structure)
10. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Architecture Overview

```
Excel Datasets / S&P Global Exports
       │
       ▼
Python + Pandas (scripts/import_excel.py & POST /vessels/import)
       │
Data Cleaning, Normalization & Duplicate IMO Detection
       │
       ▼
PostgreSQL Database (SQLAlchemy ORM + Alembic)
       │
       ▼
FastAPI REST API Service (http://localhost:8000)
       │
       ▼ HTTP / JSON (CORS Enabled)
React + TypeScript Frontend (http://localhost:5173)
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, ECharts.
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0, Alembic, Pydantic v2, Pandas, OpenPyXL.
- **Database**: PostgreSQL 16 (or SQLite fallback for quick testing).

---

## Prerequisites & System Requirements

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (`v20+` recommended) — [Download Node.js](https://nodejs.org/)
- **npm**: `v9.0.0` or higher (bundled with Node.js)
- **Python**: `3.11` or higher — [Download Python](https://www.python.org/)
- **PostgreSQL**: `14` or higher (`16` recommended) — [Download PostgreSQL](https://www.postgresql.org/)
  - On macOS via Homebrew: `brew install postgresql@16 && brew services start postgresql@16`

---

## Quick Start (Fast Setup)

If you already have PostgreSQL running, open two terminal windows:

### Terminal 1 — Backend
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate                # On Windows: venv\Scripts\activate
pip install -r requirements.txt psycopg[binary]
PYTHONPATH=. python scripts/seed_data.py
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## Step-by-Step Installation Guide

### Step 1: Database Setup (PostgreSQL)

1. Start your local PostgreSQL server:
   - **macOS (Homebrew)**:
     ```bash
     brew services start postgresql@16
     ```
   - **Linux (systemd)**:
     ```bash
     sudo systemctl start postgresql
     ```
   - **Windows**: Start the PostgreSQL service from Services app or pgAdmin.

2. Create the database user and database:
   ```bash
   psql -U postgres -c "CREATE ROLE aquaxfoul_user WITH LOGIN PASSWORD 'aquaxfoul_dev';"
   psql -U postgres -c "CREATE DATABASE aquaxfoul OWNER aquaxfoul_user;"
   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE aquaxfoul TO aquaxfoul_user;"
   ```

*(Note: On macOS if your user is `aryankumar`, run `psql -U aryankumar -d postgres` and execute the SQL commands above).*

---

### Step 2: Backend Setup (FastAPI)

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **macOS / Linux**:
     ```bash
     python3.11 -m venv venv
     source venv/bin/activate
     ```
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. Upgrade `pip` and install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt psycopg[binary]
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env` (or verify `backend/.env` exists):
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains:
   ```env
   DATABASE_URL=postgresql://aquaxfoul_user:aquaxfoul_dev@localhost:5432/aquaxfoul
   APP_NAME=Aqua-X-Foul Maritime Intelligence Platform
   DEBUG=True
   SECRET_KEY=aqua-xfoul-secret-key-2026-production-ready
   ```

5. Seed the database with initial commercial vessels, fouling assessments, cleaning events, and performance records:
   ```bash
   PYTHONPATH=. python scripts/seed_data.py
   ```
   *Output: `Database seeding completed with fleet dataset!`*

6. Start the FastAPI development server:
   ```bash
   PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

### Step 3: Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Ensure `frontend/.env` contains:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_APP_ENV=development
   VITE_ENABLE_MOCK_FALLBACK=true
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## Running the Application

Once both servers are running:

| Component | URL | Description |
|---|---|---|
| **Frontend Web App** | [http://localhost:5173](http://localhost:5173) | Main interactive maritime dashboard |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | FastAPI REST service |
| **Interactive API Docs (Swagger)** | [http://localhost:8000/docs](http://localhost:8000/docs) | Live endpoint testing & schemas |
| **Alternative API Docs (ReDoc)** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Detailed endpoint documentation |
| **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | System health & DB connection check |

---

## Excel Data Ingestion Pipeline

The platform supports ingesting Excel datasets (`.xlsx`, `.xls`) with automatic header normalization, duplicate IMO identification, and data validation.

### Option A: Via Command Line (Batch Ingestion)
```bash
cd backend
source venv/bin/activate
PYTHONPATH=. python scripts/import_excel.py --folder ./data/excels --sheet-type-column "Ship Type"
```

If your Excel file names indicate the ship type (e.g. `ContainerShip_2024.xlsx`):
```bash
PYTHONPATH=. python scripts/import_excel.py --folder ./data/excels --type-from-filename
```

### Option B: Via REST API
```bash
curl -X POST http://localhost:8000/api/v1/vessels/import \
  -F "file=@/path/to/vessels.xlsx"
```

The response returns an import summary:
```json
{
  "records_processed": 142,
  "new_vessels": 128,
  "updated_vessels": 0,
  "duplicates_detected": 4,
  "invalid_records": 10,
  "status": "Import completed"
}
```

---

## Running Automated Tests

### 1. Backend Test Suite (Pytest)
From the `backend` directory:
```bash
cd backend
source venv/bin/activate
PYTHONPATH=. pytest -v
```
**Test coverage includes**:
- Vessel CRUD, search, and server-side pagination
- Ship type and risk filtering
- Dashboard KPI aggregation and distribution calculation
- Biofouling projection scenarios A/B/C
- User authentication and session check
- Excel file ingestion and duplicate handling

### 2. Frontend Test Suite (Vitest)
From the `frontend` directory:
```bash
cd frontend
npm test
```

### 3. Frontend Production Build Check
```bash
cd frontend
npm run build
```

---

## Project Directory Structure

```
aqua-xfoul/
├── backend/
│   ├── app/
│   │   ├── api/routes/          # REST route handlers (vessels, dashboard, fouling, cleaning, projections, auth)
│   │   ├── core/                # Configuration and environment settings
│   │   ├── database/            # Database engine and session lifecycle
│   │   ├── models/              # SQLAlchemy models (Vessel, ShipType, Fouling, Cleaning, Inspection, User)
│   │   ├── repositories/        # Database queries, filters, search, pagination
│   │   ├── schemas/             # Pydantic validation and serialization schemas
│   │   ├── services/            # Business logic (Dashboard aggregates, Projections, Excel ingestion)
│   │   └── main.py              # FastAPI app initialization, CORS, lifespan
│   ├── scripts/
│   │   ├── import_excel.py      # Excel ingestion CLI
│   │   └── seed_data.py         # Initial database seeder
│   ├── tests/                   # Pytest automated test suite
│   ├── Dockerfile               # Production container configuration
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   └── README.md                # Backend technical specification
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components, layout, dashboard cards, vessel tabs
│   │   ├── context/             # AuthContext, DateRangeContext
│   │   ├── pages/               # Dashboard, Fleet, VesselDetails, Fouling, Cleaning, Projections, Settings
│   │   ├── services/            # Axios API client & backend service integration
│   │   ├── types/               # TypeScript interfaces & domain types
│   │   └── main.tsx             # React entry point
│   ├── package.json             # Node dependencies and scripts
│   ├── vite.config.ts           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS theme tokens
│
├── README.md                    # This Startup Guide
└── STARTUP.md                   # Quick Reference Startup Guide
```

---

## Troubleshooting & FAQs

### Q: `column vessels.yard_number does not exist` or table schema mismatch
**Solution**: Re-run the table creation and seeder:
```bash
cd backend
source venv/bin/activate
PYTHONPATH=. python -c "from app.models import Base; from app.database.session import engine; Base.metadata.create_all(bind=engine)"
PYTHONPATH=. python scripts/seed_data.py
```

### Q: `CORS policy: No 'Access-Control-Allow-Origin'` in the browser console
**Solution**: Make sure the backend is running with `CORS_ORIGINS` enabled. The backend is configured to accept origins from `http://localhost:5173` and `*` automatically.

### Q: Frontend cannot connect to the backend (falling back to mock data)
**Solution**: Verify that the backend is running at `http://localhost:8000` by visiting `http://localhost:8000/health`. Check that `frontend/.env` contains `VITE_API_BASE_URL=http://localhost:8000/api/v1`.

### Q: How do I run both services in the background?
- **macOS / Linux**:
  ```bash
  # Start Backend in background
  cd backend && source venv/bin/activate && PYTHONPATH=. nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
  # Start Frontend in background
  cd frontend && nohup npm run dev > frontend.log 2>&1 &
  ```
