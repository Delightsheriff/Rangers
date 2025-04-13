'use client';

import React from 'react';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardNav from '@/components/dashboard/dashboard-nav';


function ExpensesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6"></main>
      </div>
    </div>
  );
}

export default ExpensesPage;
