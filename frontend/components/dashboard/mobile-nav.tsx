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
  Wallet,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface MobileNavProps {
  onNavItemClick?: () => void;
}

export default function MobileNav({ onNavItemClick }: MobileNavProps) {
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
  ];

  // Determine active item based on the current path
  const getActiveItem = () => {
    const path = pathname.split('/')[2]; // Get the second segment after /dashboard/
    if (!path) return 'dashboard';
    return path;
  };

  const activeItem = getActiveItem();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
          onClick={onNavItemClick}
        >
          <div className="rounded-full bg-primary p-1 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span>SplitWise</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeItem === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            onClick={onNavItemClick}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
