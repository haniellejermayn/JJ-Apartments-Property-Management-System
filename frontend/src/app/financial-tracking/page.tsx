"use client";
import React from 'react';
import FinancialList from '@/components/FinancialList';
import ExpenseList from '@/components/ExpenseList';

const MainContent = () => (
  <div className="flex-1 flex flex-col min-h-screen">
    <header className="bg-white shadow-sm border-b p-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Financial Tracking</h1>
      </div>
    </header>
    <div className="flex flex-1">
      <div className="w-1/2 p-2">
        <FinancialList />
      </div>
      <div className="w-1/2 p-2">
        <ExpenseList />
      </div>
    </div>
  </div>
);

export default function FinancialOverview() {
  return (
    <div className="h-screen bg-gray-100">
      <MainContent />
    </div>
  );
}