"use client";
import React, { useState } from 'react';

// Initial dummy data for additional expenses
const initialExpenses = [
  { id: 1, number: '#110', description: 'Kitchen repair', cost: 5000 },
  { id: 2, number: '#112', description: 'Deep cleaning', cost: 2500 },
];

export default function ExpenseList() {
  const [expenses, setExpenses] = useState(initialExpenses);

  const handleAdd = () => {
    // Placeholder: open modal or form
    console.log('Add expense clicked');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Additional Expenses</h2>
        <button
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Add Expense
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost (₱)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((exp, idx) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{exp.number}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{exp.description}</td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">{exp.cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
