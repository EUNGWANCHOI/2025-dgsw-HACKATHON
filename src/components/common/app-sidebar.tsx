'use client';

import {
  Home,
  Upload,
  User,
  PanelLeft,
  BotMessageSquare,
  LayoutDashboard,
  Rss,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/feed',
      label: '피드',
      icon: Rss,
    },
    {
      href: '/dashboard',
      label: '대시보드',
      icon: LayoutDashboard,
    },
    {
      href: '/upload',
      label: '콘텐츠 업로드',
      icon: Upload,
    },
    {
      href: '/profile',
      label: '프로필',
      icon: User,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Link href="/feed" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Critical" width={100} height={25} />
            </Link>
          <SidebarTrigger className="ml-auto md:hidden">
            <PanelLeft />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Button
                asChild
                variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
