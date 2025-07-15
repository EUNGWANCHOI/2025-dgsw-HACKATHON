import { PlusCircle, Upload } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ContentCard from './content-card';
import { getContents } from '@/lib/data';

export default async function ContentDashboard() {
  const contents = await getContents();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">모든 콘텐츠</h2>
        <Button asChild>
          <Link href="/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            새 콘텐츠 업로드
          </Link>
        </Button>
      </div>

      {contents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            아직 콘텐츠가 없습니다
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            피드백을 위해 첫 번째 콘텐츠를 업로드하여 시작하세요.
          </p>
          <Button asChild className="mt-4">
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              콘텐츠 업로드
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
