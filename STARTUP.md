# Quick Startup Guide — Aqua-X-Foul

Follow this quick guide to run the **Aqua-X-Foul** platform locally.

---

## 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.11+
- **PostgreSQL**: 14+ (16 recommended)

---

## 2. PostgreSQL Setup
```bash
# macOS (Homebrew):
brew services start postgresql@16

# Create user & database in psql:
psql -U postgres -c "CREATE ROLE aquaxfoul_user WITH LOGIN PASSWORD 'aquaxfoul_dev';"
psql -U postgres -c "CREATE DATABASE aquaxfoul OWNER aquaxfoul_user;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE aquaxfoul TO aquaxfoul_user;"
```

---

## 3. Backend Setup & Run (Terminal 1)
```bash
cd backend

# Create & activate venv
python3.11 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt psycopg[binary]

# Seed database with vessels & history
PYTHONPATH=. python scripts/seed_data.py

# Start FastAPI server on port 8000
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 4. Frontend Setup & Run (Terminal 2)
```bash
cd frontend

# Install packages
npm install

# Start Vite dev server on port 5173
npm run dev
```

---

## 5. URLs & Services
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 6. Running Tests
- **Backend Tests (11 tests)**:
  ```bash
  cd backend && PYTHONPATH=. pytest -v
  ```
- **Frontend Tests (3 tests)**:
  ```bash
  cd frontend && npm test
  ```
- **Frontend Production Build**:
  ```bash
  cd frontend && npm run build
  ```
