"use client";
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Unit } from '@/components/expenses-list'
import AddPaymentButton from "@/components/add-payment-button";

type Payment = {
    id: number,
    unitId: number,
    modeOfPayment: string,
    amount: number,
    dueDate: string,
    monthOfStart: string,
    monthOfEnd: string,
    isPaid: boolean,
    paidAt: string,
}


export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const [paymentsRes, unitsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
        ])



        if (!paymentsRes.ok) throw new Error(`Payments API error: ${paymentsRes.status}`);
        if (!unitsRes.ok) throw new Error(`Units API error: ${unitsRes.status}`);

        const [paymentsData, unitsData] = await Promise.all([
            paymentsRes.json(),
            unitsRes.json()
        ])

     

        setPayments(paymentsData);
        setUnits(unitsData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

   const unitMap = useMemo(() => {
    const map = new Map<number, string>();
    units.forEach((u) => {
      map.set(u.id, `Unit ${u.unitNumber} - ${u.name}`);
    });
    return map;
  }, [units]);

  const createTable = (data: Payment[]) => {
    return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Payments</h2>
        <AddPaymentButton/>
      </div>
      <div className="overflow-x-auto rounded shadow border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode of Payment</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">For the Month Of</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((p) => {
              const unitName = unitMap.get(p.unitId) || "—";
              return (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-4 text-sm text-gray-900">{unitName}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{p.modeOfPayment}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                    ₱{p.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {p.monthOfStart && p.monthOfEnd 
                    ? new Date(p.monthOfStart).toLocaleDateString() + " - " + new Date(p.monthOfEnd).toLocaleDateString() 
                    : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full text-white ${
                        p.isPaid ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {p.isPaid ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {p.isPaid && p.paidAt
                      ? new Date(p.paidAt).toLocaleDateString()
                      : '—'}
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

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="space-y-2">
      {createTable(payments)}
    </div>
  );
}