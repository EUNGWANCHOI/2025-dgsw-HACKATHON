import AppSidebar from '@/components/common/app-sidebar';
import Header from '@/components/common/header';
import ContentDashboard from '@/components/content/content-dashboard';
import { SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <SidebarInset>
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <ContentDashboard />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
