import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { CitizenPortalPage } from '../pages/CitizenPortalPage';
import { GisMapPage } from '../pages/GisMapPage';
import { FaultIntakesPage } from '../pages/FaultIntakesPage';
import { WorkOrdersPage } from '../pages/WorkOrdersPage';
import { FieldQueuePage } from '../pages/FieldQueuePage';
import { SlaAnalyticsPage } from '../pages/SlaAnalyticsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/citizen" element={<CitizenPortalPage />} />
      <Route path="/grievances" element={<Navigate to="/citizen" replace />} />

      {/* Municipal Operations Console (Protected by JWT & Roles) */}
      <Route
        path="/gis-map"
        element={
          <ProtectedRoute allowedRoles={['ward_officer', 'field_tech']}>
            <GisMapPage />
          </ProtectedRoute>
        }
      />
      <Route path="/assets" element={<Navigate to="/gis-map" replace />} />

      <Route
        path="/fault-intakes"
        element={
          <ProtectedRoute allowedRoles={['ward_officer', 'field_tech']}>
            <FaultIntakesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/triage" element={<Navigate to="/fault-intakes" replace />} />

      <Route
        path="/work-orders"
        element={
          <ProtectedRoute allowedRoles={['ward_officer', 'field_tech']}>
            <WorkOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/field-queue"
        element={
          <ProtectedRoute allowedRoles={['field_tech', 'ward_officer']}>
            <FieldQueuePage />
          </ProtectedRoute>
        }
      />
      <Route path="/technician" element={<Navigate to="/field-queue" replace />} />

      {/* SLA Analytics - Restricted Strictly to Ward Officer */}
      <Route
        path="/sla-analytics"
        element={
          <ProtectedRoute allowedRoles={['ward_officer']}>
            <SlaAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/analytics" element={<Navigate to="/sla-analytics" replace />} />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
