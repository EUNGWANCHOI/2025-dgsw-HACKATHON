import AppSidebar from '@/components/common/app-sidebar';
import Header from '@/components/common/header';
import Dashboard from '@/components/dashboard/dashboard';
import { SidebarInset } from '@/components/ui/sidebar';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <SidebarInset>
          <Header title="대시보드" />
          <main className="p-4 sm:p-6 lg:p-8">
            <Dashboard />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
