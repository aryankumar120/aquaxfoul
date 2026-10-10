# Aqua-X-Foul Maritime Platform

Maritime vessel management and biofouling intelligence dashboard.

---

## 1. Architecture

```
Excel Datasets / S&P Global Exports
       │
       ▼
Python + Pandas Data Ingestion & Validation
       │
       ▼
PostgreSQL Database (SQLAlchemy ORM + Alembic)
       │
       ▼
FastAPI REST Backend (http://localhost:8000)
       │
       ▼ HTTP / JSON
React + TypeScript Frontend (http://localhost:5173)
```

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, ECharts
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0, Alembic, Pydantic v2
- **Database**: PostgreSQL 16

---

## 2. Prerequisites & Installation

Make sure the following are installed on your system:
- **Node.js**: v18+ or v20+ & npm — [nodejs.org](https://nodejs.org/)
- **Python**: 3.11+ — [python.org](https://www.python.org/)
- **PostgreSQL**: 14+ (16 recommended) — [postgresql.org](https://www.postgresql.org/)

---

## 3. Database Setup (PostgreSQL)

Start PostgreSQL and create the database user and database:

```bash
# macOS (Homebrew):
brew services start postgresql@16

# Run in psql:
psql -U postgres -c "CREATE ROLE aquaxfoul_user WITH LOGIN PASSWORD 'aquaxfoul_dev';"
psql -U postgres -c "CREATE DATABASE aquaxfoul OWNER aquaxfoul_user;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE aquaxfoul TO aquaxfoul_user;"
```

---

## 4. Backend Setup & Run

Open a terminal and run:

```bash
cd backend

# 1. Create and activate virtual environment
python3.11 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt psycopg[binary]

# 3. Seed database with initial fleet data
PYTHONPATH=. python scripts/seed_data.py

# 4. Start FastAPI server
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs

---

## 5. Frontend Setup & Run

Open a second terminal and run:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

- **Frontend Web App**: http://localhost:5173
