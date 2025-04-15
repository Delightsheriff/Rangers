'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  FileText,
  Settings,
  Wallet,
} from 'lucide-react';

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      id: 'dashboard',
    },
    {
      name: 'Groups',
      href: '/dashboard/groups',
      icon: Users,
      id: 'groups',
    },
    {
      name: 'Expenses',
      href: '/dashboard/expenses',
      icon: Receipt,
      id: 'expenses',
    },
    {
      name: 'Settlements',
      href: '/dashboard/settlements',
      icon: CreditCard,
      id: 'settlements',
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText,
      id: 'reports',
    },
    {
      name: 'Wallet',
      href: '/dashboard/wallet',
      icon: Wallet,
      id: 'wallet',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      id: 'settings',
    },
  ];

  // Determine active item based on the current path
  const getActiveItem = () => {
    const path = pathname.split('/')[2]; // Get the second segment after /dashboard/
    if (!path) return 'dashboard';
    return path;
  };

  const activeItem = getActiveItem();

  return (
    <nav className="hidden border-r bg-card md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-2">
          <h3 className="px-4 text-sm font-medium text-muted-foreground">Menu</h3>
          <ul className="mt-2 grid gap-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium',
                    activeItem === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
