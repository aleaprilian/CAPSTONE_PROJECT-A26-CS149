import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';

export default function DashboardLayout() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar terbuka={menuTerbuka} onTutup={() => setMenuTerbuka(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onBukaMenu={() => setMenuTerbuka(true)} />
        <main className="flex-1 px-4 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
