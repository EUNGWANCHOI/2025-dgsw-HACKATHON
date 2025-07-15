import AppSidebar from '@/components/common/app-sidebar';
import Header from '@/components/common/header';
import Feed from '@/components/content/feed';
import { SidebarInset } from '@/components/ui/sidebar';

export default function FeedPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <SidebarInset>
          <Header title="피드" />
          <main className="p-4 sm:p-6 lg:p-8">
            <Feed />
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
