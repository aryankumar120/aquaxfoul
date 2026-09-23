# Aqua-X-Foul — Maritime Biofouling Intelligence Dashboard

The frontend application for **Aqua-X-Foul**, an enterprise-grade maritime vessel management and biofouling intelligence platform designed to reduce excess hydrodynamic drag, prevent fuel wastage, and eliminate invasive species transfer across commercial shipping fleets.

---

## 🚀 Technology Stack

- **Core Framework:** React 18 with TypeScript 5
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS with custom maritime ocean design tokens
- **Data Visualizations:** Apache ECharts (`echarts` & `echarts-for-react`)
- **State Management & Caching:** TanStack Query (`@tanstack/react-query`)
- **HTTP Client:** Axios (configured with interceptors & JWT handling)
- **Routing:** React Router v6 (`react-router-dom`)
- **Iconography:** Lucide React
- **Unit/Component Testing:** Vitest, React Testing Library, jsdom
- **End-to-End Testing:** Playwright

---

## 📁 Application Architecture

```
frontend/
├── e2e/                     # Playwright End-to-End test suites
├── public/
│   ├── favicon.svg          # Aqua-X-Foul wave glyph
│   └── videos/              # Supports ocean.mp4 looping video
├── src/
│   ├── assets/              # Maritime silhouettes, ship graphics
│   ├── components/
│   │   ├── common/          # StatusBadge, MetricCard, Sparkline, LoadingSkeleton, EmptyState, ErrorState
│   │   ├── layout/          # Sidebar, Header, AppLayout
│   │   ├── charts/          # ECharts Donut, Bar, Trend, and Multi-Scenario Projections
│   │   ├── dashboard/       # WelcomeBanner, KpiGrid, RecentVesselsTable, RecentAlertsList
│   │   ├── fleet/           # VesselTable, FilterBar, PaginationControls
│   │   └── vessel/          # VesselHeader, Overview, Technical, Management, Performance, Fouling, Cleaning, Projections
│   ├── context/             # AuthContext (login/logout, mock token, user session)
│   ├── mocks/               # Realistic maritime datasets (142 vessels, inspections, cleanings, projections)
│   ├── pages/               # Login, Dashboard, Fleet, VesselDetails, Fouling, Cleaning, Projections, Reports, Settings, Help
│   ├── routes/              # AppRoutes, ProtectedRoute
│   ├── services/            # Axios API clients (authApi, vesselApi, dashboardApi, projectionApi, reportApi)
│   ├── test/                # Vitest test setup and test suites
│   ├── types/               # TypeScript models (Vessel, Fouling, Cleaning, Projection, Report, User)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── playwright.config.ts
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

---

## ⚡ Installation & Quick Start

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🔐 Authentication & Demo Credentials

When running without an active backend service, the client automatically utilizes a mock session for seamless evaluation:

- **Username / Email:** `aryan@aqua-xfoul.com`
- **Role:** Administrator
- **1-Click Access:** Click the "Use 1-Click Administrator Session (Demo)" link on the login page to enter immediately.

---

## 📡 API Integration & FastAPI Backend Configuration

All network communication is isolated within `src/services/` using Axios and reads the backend endpoint from `VITE_API_BASE_URL`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Automatic Mock Fallback
If the FastAPI backend is not currently running or returns an error, all service modules (`vesselApi`, `dashboardApi`, `projectionApi`, `reportApi`, `authApi`) automatically fall back to realistic maritime mock datasets matching the exact schema expected from the production FastAPI backend.

### Server-Side Pagination
The fleet directory service supports server-side pagination with query parameters:
```http
GET /vessels?page=1&limit=25&search=pioneer&type=Container%20Ship&sortBy=dwt&sortOrder=desc
```

---

## 🧪 Testing

### Run Unit and Component Tests (Vitest + RTL):
```bash
npm test
```

### Run Vitest in Watch Mode:
```bash
npm run test:watch
```

### Run Playwright E2E Tests:
```bash
npm run test:e2e
```

---

## 🏗️ Production Build & Preview

### Build the production bundle:
```bash
npm run build
```

This compiles TypeScript and bundles assets into `dist/` with vendor chunk splitting (`vendor-react`, `vendor-echarts`, `vendor-query`, `vendor-icons`).

### Preview the production build locally:
```bash
npm run preview
```

---

## 🚢 Key Modules & Feature Highlights

1. **Main Fleet Dashboard:**
   - Visual parity with official Aqua-X-Foul design reference.
   - 5 KPI metric cards with sparkline curves (Total Vessels: 142, Active: 128, Requiring Attention: 14, Cleaning Due: 26, Estimated CO2 Savings: 2,840 t).
   - Donut Chart for Vessel Distribution by Type with center summary.
   - Fouling Risk Distribution bar chart (Low, Moderate, High, Critical).
   - Smooth 6-month fuel consumption trend area line chart.
   - Recent vessels table with status and risk badges.
   - Recent alerts feed with severity color indicators.

2. **Fleet Directory:**
   - Multi-field search across Vessel Name, IMO, and Technical Manager.
   - Dimensional filters: Vessel Type, Fouling Risk, Operational Status, Manager Domicile, Minimum DWT.
   - Multi-column sortable table headers.
   - Server-style pagination and selectable page size.

3. **Vessel Details Page (`/vessels/:id`):**
   - 7 dedicated tabs: **Overview**, **Technical**, **Management**, **Performance**, **Fouling**, **Cleaning**, and **Projections**.
   - Structured naval particulars (IMO, Yard Number, DWT, GT, TEU, TEU 14, engine & coating specs).
   - Historical telemetry and underwater drone inspection reports.

4. **Decision-Support Projections:**
   - 12-month predictive modeling comparing 3 distinct scenarios:
     - **Scenario A:** No Cleaning (Status Quo — progressive drag penalty).
     - **Scenario B:** Clean Now (Immediate in-water robotic ROV cleaning).
     - **Scenario C:** Clean Later (Optimal synchronized port window).
   - Visual separation: Solid lines for historical baseline, dashed lines for projected intervals.
   - Net fuel burn, CO2 abatement, and financial ROI calculations.

5. **Reports & Exports:**
   - Instant filtering and mock file downloads for regulatory audits, IMO DCS carbon logs, and cleaning ROI dossiers.

---

## 🐳 Docker Deployment

To package the frontend into a lightweight container:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📄 License & Attribution

Proprietary software developed for **Aqua-X-Foul Maritime Biofouling Management Platform**.
*Cleaner Vessels. Greener Oceans.*
