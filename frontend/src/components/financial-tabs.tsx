'use client';
import React, { useState } from 'react';

const tabs = ['Utilities', 'Payments', 'Expenses'];
type FinancialTabsProps = {
  utilitiesContent: React.ReactNode;
  paymentsContent: React.ReactNode;
  expensesContent: React.ReactNode;
};
export default function FinancialTabs({
  utilitiesContent,
  paymentsContent,
  expensesContent,
}: FinancialTabsProps) {
  const [activeTab, setActiveTab] = useState('Utilities');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Utilities':
        return utilitiesContent;
      case 'Payments':
        return paymentsContent;
      case 'Expenses':
        return expensesContent;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* Tab Headers */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}