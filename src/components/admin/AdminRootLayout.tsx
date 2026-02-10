// FIX: Replaced placeholder content with a functional AdminRootLayout component.
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminRootLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-void">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRootLayout;
