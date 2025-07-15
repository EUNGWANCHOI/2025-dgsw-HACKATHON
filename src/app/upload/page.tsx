import AppSidebar from '@/components/common/app-sidebar';
import Header from '@/components/common/header';
import UploadForm from '@/components/content/upload-form';
import { SidebarInset } from '@/components/ui/sidebar';

export default function UploadPage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <SidebarInset>
          <Header title="콘텐츠 업로드" />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">콘텐츠 업로드</h1>
                <p className="text-muted-foreground">
                  AI 기반 피드백과 커뮤니티의 의견을 받아보세요.
                </p>
              </div>
              <UploadForm />
            </div>
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
