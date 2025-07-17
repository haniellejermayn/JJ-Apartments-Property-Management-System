"use client";
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

type Expense = {
    id: number,
    unitId: number,
    amount: number,
    reason: string,
    date: string
}

export type Unit = {
  id: number,
  unitNumber: string,
  name: string,
  description: string,
  price: string,
  numOccupants: number,
  contactNumber: string
}

export default function ExpensesList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const [expensesRes, unitsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
        ])

        if (!expensesRes.ok) throw new Error(`Expenses API error: ${expensesRes.status}`);
        if (!unitsRes.ok) throw new Error(`Units API error: ${unitsRes.status}`);

        const [expensesData, unitsData] = await Promise.all([
            expensesRes.json(),
            unitsRes.json()
        ])

        setExpenses(expensesData);
        setUnits(unitsData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const unitMap = useMemo(() => {
    const map = new Map<number, string>();
    units.forEach((u) => {
      map.set(u.id, `Unit ${u.unitNumber} - ${u.name}`);
    });
    return map;
  }, [units]);

  const createTable = (data: Expense[]) => {
    return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Expenses</h2>
        <Button
          // onClick={() => setModalOpen(true)}
        >
          Add
        </Button>
      </div>
      <div className="overflow-x-auto rounded shadow border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((e) => {
              const unitName = unitMap.get(e.unitId) || "—";
              return (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-4 text-sm text-gray-900">{unitName}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{e.reason}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                    ₱{e.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    );
  }

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="space-y-2">
      {createTable(expenses)}
    </div>
  );
}