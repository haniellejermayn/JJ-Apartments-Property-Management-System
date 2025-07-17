"use client";
import React from 'react';
import UtilitiesList from '@/components/utilities-list';
import ExpenseList from '@/components/expenses-list';
import PaymentList from '@/components/payments-list';
import FinancialTabs from '@/components/financial-tabs'


const MainContent = () => (
  <div className="flex-1 flex flex-col min-h-screen">
    <header className="bg-white shadow-sm border-b p-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Financial Tracking</h1>
      </div>
    </header>
    <FinancialTabs
      utilitiesContent={<UtilitiesList />}
      paymentsContent={<PaymentList />}
      expensesContent={<ExpenseList />}
    />
  </div>
);

export default function FinancialOverview() {
  return (
    <div className="h-screen bg-gray-100">
      <MainContent />
    </div>
  );
}