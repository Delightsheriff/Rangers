import type React from 'react';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardNav from '@/components/dashboard/dashboard-nav';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Providers from '@/components/Providers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <Providers session={session}>
      <div className="flex min-h-screen flex-col mx-w-[1280px] mx-auto">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardNav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
