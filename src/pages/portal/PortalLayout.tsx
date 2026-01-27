import { Outlet } from 'react-router-dom';
import { PortalSidebar } from '@/components/portal/PortalSidebar';

export default function PortalLayout() {
  return (
    <div className="min-h-screen bg-background">
      <PortalSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
