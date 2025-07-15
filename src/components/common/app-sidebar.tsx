'use client';

import {
  Home,
  Upload,
  User,
  PanelLeft,
  BotMessageSquare,
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

export default function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/upload',
      label: 'Upload Content',
      icon: Upload,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10">
            <BotMessageSquare className="size-6" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tighter">
              Critical
            </h2>
            <p className="text-xs text-muted-foreground">AI Content Feedback</p>
          </div>
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
                variant={pathname === item.href ? 'secondary' : 'ghost'}
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
