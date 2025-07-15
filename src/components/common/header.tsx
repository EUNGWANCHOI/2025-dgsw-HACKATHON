import { Bell, PanelLeft, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentUser } from '@/lib/data';

export default async function Header({ title }: { title: string }) {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <PanelLeft />
        </SidebarTrigger>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="콘텐츠 검색..."
          className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>

      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">알림 토글</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">사용자 메뉴 토글</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>설정</DropdownMenuItem>
          <DropdownMenuItem>지원</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>로그아웃</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
