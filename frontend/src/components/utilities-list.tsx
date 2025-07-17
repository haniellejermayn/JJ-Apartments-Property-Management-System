"use client";
import { useEffect, useState, useMemo } from 'react';
import AddUtilityButton from '@/components/add-utility-button';
import { Unit } from '@/components/expenses-list'

type Utility = {
  id: number,
  type: string,
  previousReading: number,
  currentReading: number,
  totalMeter: number,
  totalAmount: number,
  dueDate: string,
  monthOfStart: string,
  monthOfEnd: string,
  isPaid: boolean,
  paidAt: string,
  unitId: number,
  rateId: number
}

export default function UtilitiesList() {
  const [meralco, setMeralco] = useState<Utility[]>([]);
  const [water, setWater] = useState<Utility[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        setLoading(true);
        setError(null);
        const [meralcoRes, waterRes, unitsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/utilities/type?type=Meralco`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/utilities/type?type=Manila Water`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
        ])



        if (!meralcoRes.ok) throw new Error(`Utilities API error: ${meralcoRes.status}`);
        if (!waterRes.ok) throw new Error(`Utilities API error: ${waterRes.status}`);
        if (!unitsRes.ok) throw new Error(`Units API error: ${unitsRes.status}`);

        const [meralcoData, waterData, unitsData] = await Promise.all([
          meralcoRes.json(), 
          waterRes.json(), 
          unitsRes.json()
        ])

     

        setMeralco(meralcoData);
        setWater(waterData);
        setUnits(unitsData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchUtilities();
  }, []);

  const unitMap = useMemo(() => {
    const map = new Map<number, string>();
    units.forEach((u) => {
      map.set(u.id, `Unit ${u.unitNumber} - ${u.name}`);
    });
    return map;
  }, [units]);
  
  const createTable = (data: Utility[], type: string) => {
    const isMeralco = type.toLowerCase().includes("meralco");
    const unitLabel = isMeralco ? "kWh" : "Cubic";
    return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{type}</h2>
          <AddUtilityButton />
      </div>
      <div className="overflow-x-auto rounded shadow border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Reading</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Reading</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total {unitLabel} Meter</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">For the Month Of</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((u) => {
              const unitName = unitMap.get(u.unitId) || "—";
              return (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-4 text-sm text-gray-900">{unitName}</td>
                  <td className="px-4 py-4 text-right text-sm text-gray-900">{u.previousReading}</td>
                  <td className="px-4 py-4 text-right text-sm text-gray-900">{u.currentReading}</td>
                  <td className="px-4 py-4 text-right text-sm text-gray-900">{u.totalMeter}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    ₱{u.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(u.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(u.monthOfStart).toLocaleDateString()} - {new Date(u.monthOfEnd).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full text-white ${
                        u.isPaid ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {u.isPaid ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {u.isPaid && u.paidAt
                      ? new Date(u.paidAt).toLocaleDateString()
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

  if (loading) return <p>Loading utilities...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="space-y-2">
      {createTable(meralco, "Meralco")}
      {createTable(water, "Manila Water")}
    </div>
  );
}