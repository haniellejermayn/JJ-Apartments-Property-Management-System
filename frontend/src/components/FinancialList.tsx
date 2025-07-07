"use client";
import React, { useState } from 'react';

// Initial dummy data for financials with independent paid statuses
const initialFinancials = [
  { id: 1, number: '#110', electricity: 1200, water: 800, rent: 12000, paidElectricity: false, paidWater: false, paidRent: false },
  { id: 2, number: '#111', electricity: 1500, water: 900, rent: 15000, paidElectricity: true, paidWater: true, paidRent: true },
  { id: 3, number: '#112', electricity: 1000, water: 700, rent: 10000, paidElectricity: false, paidWater: false, paidRent: false },
];

export default function FinancialList() {
  const [financials, setFinancials] = useState(initialFinancials);

  const togglePaid = (id, field) => {
    setFinancials(financials.map(item =>
      item.id === id ? { ...item, [field]: !item[field] } : item
    ));
  };

  const calcDue = item => {
    let due = 0;
    if (!item.paidElectricity) due += item.electricity;
    if (!item.paidWater) due += item.water;
    if (!item.paidRent) due += item.rent;
    return due;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Electricity (₱)</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Water (₱)</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rent (₱)</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Elec Paid</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Water Paid</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Paid</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Due (₱)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {financials.map((item, idx) => {
              const due = calcDue(item);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.number}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">{item.electricity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">{item.water.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">{item.rent.toLocaleString()}</td>
                  {['paidElectricity','paidWater','paidRent'].map((field, i) => {
                    const paid = item[field];
                    const label = paid ? 'Yes' : 'No';
                    const cls = paid ? 'bg-green-500' : 'bg-red-500';
                    return (
                      <td
                        key={field}
                        className="px-6 py-4 text-center text-sm"
                        onClick={() => togglePaid(item.id, field)}
                      >
                        <span className={`${cls} inline-block px-2 py-1 rounded-full text-white text-xs uppercase cursor-pointer`}>{label}</span>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">{due.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={8} className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total Due:</td>
              <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                {financials.reduce((sum, itm) => sum + calcDue(itm), 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}