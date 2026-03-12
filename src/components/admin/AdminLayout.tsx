import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-void">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-secondary-50 mb-4">Access Denied</h1>
          <p className="text-secondary-400">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminLayout;
