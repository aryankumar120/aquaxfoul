# Aqua-X-Foul Backend API & Data Layer

A high-performance FastAPI and PostgreSQL backend powering the **Aqua-X-Foul Maritime Biofouling Management Platform**.

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
FastAPI REST API Service (/api/v1)
       │
       ▼
React + TypeScript Frontend Dashboard
```

---

## Core Entities & Schema

1. **Vessels (`vessels`)**:
   - Primary Identifiers: `id`, `imo_number` (unique index), `name`, `yard_number`
   - Management: `technical_manager`, `manager_domicile`, `manager_registration`
   - Parameters: `deadweight` (DWT), `gross_tonnage` (GT), `teu`, `teu_14`, `built_year`, `flag`, `length`, `length_bp`, `breadth`, `depth`, `draught`, `engine_rpm`, `service_speed`
   - Intelligence: `status`, `fouling_risk`, `fouling_rating`, `last_inspection_date`, `next_cleaning_due_date`, `fuel_consumption_tons_per_day`
2. **Ship Types (`ship_types`)**:
   - `id`, `name` (Container Ship, Bulk Carrier, Mega Container Ship, Cruise, General Cargo, LNG Carrier, Tanker)
3. **Inspection Records (`inspection_records`)**:
   - Underwater Drone / ROV, Diver Video, Dry Dock Survey, Port State Inspection
4. **Fouling Assessments (`fouling_assessments`)**:
   - Coverage %, roughness microns, speed loss %, excess fuel %, CO2 penalty tonnes
5. **Cleaning Events (`cleaning_events`)**:
   - In-water ROV grooming, before/after ratings, efficiency recovery %, cost USD, CO2 saved
6. **Performance Records (`performance_records`)**:
   - Speed, fuel consumption, slip ratio %, weather Beaufort scale
7. **Users (`users`)**:
   - Authentication and role-based access

---

## API Endpoints

### 1. System & Health
- `GET /health` & `GET /api/v1/health` — API health check
- `GET /health/db` & `GET /api/v1/health/db` — PostgreSQL database connectivity check
- `GET /docs` — Interactive OpenAPI / Swagger UI
- `GET /redoc` — ReDoc API Documentation

### 2. Vessel Management (`/api/v1/vessels`)
- `GET /api/v1/vessels` — Paginated list of vessels with search (`?search=`), filtering (`type`, `manager`, `domicile`, `status`, `foulingRisk`, `minDwt`, `maxDwt`), and sorting (`sortBy`, `sortOrder`)
- `GET /api/v1/vessels/{id}` — Individual vessel technical specs and profile (accepts ID or IMO)
- `POST /api/v1/vessels` — Register new vessel (validates unique IMO)
- `PUT /api/v1/vessels/{id}` — Update vessel specs
- `DELETE /api/v1/vessels/{id}` — Delete vessel
- `POST /api/v1/vessels/import` — Ingest Excel dataset (`.xlsx`, `.xls`) with duplicate detection
- `GET /api/v1/vessels/{id}/inspections` — Inspection history
- `GET /api/v1/vessels/{id}/fouling` — Fouling assessments
- `GET /api/v1/vessels/{id}/cleaning` — Cleaning history
- `GET /api/v1/vessels/{id}/performance` — Performance metrics
- `GET /api/v1/vessels/{id}/projections` — A/B/C cleaning scenario projections

### 3. Dashboard (`/api/v1/dashboard`)
- `GET /api/v1/dashboard/summary` — Aggregated fleet KPIs, type distribution, risk breakdown, fuel trend, recent vessels, active alerts

### 4. Biofouling & Cleaning (`/api/v1/fouling`, `/api/v1/cleaning`)
- `GET /api/v1/fouling/overview` — Fleet-wide biofouling health overview
- `GET /api/v1/cleaning/records` — Historical and scheduled cleaning logs

### 5. Projections (`/api/v1/projections`)
- `GET /api/v1/projections/{vessel_id}` — Scenario A (No Cleaning) vs B (Clean Now) vs C (Clean Later) with fuel/CO2/cost ROI

### 6. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login` — Authenticate user, returns session token
- `GET /api/v1/auth/me` — Current authenticated session profile
- `POST /api/v1/auth/logout` — Logout session

---

## Setup & Running Locally

### 1. Environment Setup
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt psycopg[binary]
```

### 2. Database Setup (PostgreSQL)
```bash
# Configure .env
DATABASE_URL=postgresql://aquaxfoul_user:aquaxfoul_dev@localhost:5432/aquaxfoul

# Seed database with initial fleet data
PYTHONPATH=. python scripts/seed_data.py
```

### 3. Running Backend Dev Server
```bash
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Running Test Suite
```bash
PYTHONPATH=. pytest -v
```

### 5. Excel Ingestion CLI
```bash
PYTHONPATH=. python scripts/import_excel.py --folder ./data/excels --sheet-type-column "Ship Type"
```
