import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showWarningToast } from '../utils/helpers';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    showWarningToast(
      'Access Restricted',
      `Role '${role}' is not authorized to access this municipal console view.`
    );
    if (role === 'field_tech') return <Navigate to="/field-queue" replace />;
    if (role === 'citizen') return <Navigate to="/citizen" replace />;
    return <Navigate to="/gis-map" replace />;
  }

  return children;
};
