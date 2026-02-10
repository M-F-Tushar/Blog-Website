import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminStarryBackground from './ui/AdminStarryBackground';
import AdminNebulaGradient from './ui/AdminNebulaGradient';
import AdminShootingStar from './ui/AdminShootingStar';
import CursorGlow from '../react/CursorGlow';
import '../admin/ui/AdminCosmicStyles.css';

const AdminRootLayout: React.FC = () => {
  return (
    <div className="admin-root flex min-h-screen bg-void relative overflow-hidden">
      <AdminStarryBackground density="sparse" />
      <AdminNebulaGradient variant="subtle" />
      <AdminShootingStar />
      <CursorGlow />
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto admin-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRootLayout;
