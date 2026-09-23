import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { FleetPage } from '../pages/Fleet/FleetPage';
import { VesselDetailsPage } from '../pages/VesselDetails/VesselDetailsPage';
import { FoulingPage } from '../pages/Fouling/FoulingPage';
import { CleaningPage } from '../pages/Cleaning/CleaningPage';
import { ProjectionsPage } from '../pages/Projections/ProjectionsPage';
import { ReportsPage } from '../pages/Reports/ReportsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { HelpPage } from '../pages/Help/HelpPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/vessels" element={<Navigate to="/fleet" replace />} />
          <Route path="/vessels/:id" element={<VesselDetailsPage />} />
          <Route path="/vessels/:id/*" element={<VesselDetailsPage />} />
          <Route path="/fouling" element={<FoulingPage />} />
          <Route path="/cleaning" element={<CleaningPage />} />
          <Route path="/projections" element={<ProjectionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
