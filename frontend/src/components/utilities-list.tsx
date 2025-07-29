"use client";
import { useEffect, useState, useMemo } from 'react';
import AddUtilityButton from '@/components/add-utility-button';
import { Unit } from '@/components/expenses-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import EditUtilityCard from './edit-utility-card'
import FilterModal from './filter-modal'
import { DeleteModal } from './delete-modal';
import { SlidersHorizontal } from 'lucide-react';

export type Utility = {
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
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState<Utility | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{unit?: number, month?: String, year?: String}>({});
  const [showConfirm, setShowConfirm] = useState(false);


  

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  }

  const filteredUtility = (data : Utility[]) => {
    return data.filter((u) => {
    const date = new Date(u.paidAt);
    const matchesUnit = !filters.unit || u.unitId == filters.unit;
    const matchesMonth = !filters.month || String(date.getMonth() + 1).padStart(2, "0") === filters.month;
    const matchesYear = !filters.year || String(date.getFullYear()) === filters.year;

    return matchesUnit && matchesMonth && matchesYear;
    })
  }

  const handleEdit = (u: Utility) => {
    setSelectedUtility(u)
    setEditOpen(true)
  }

  const handleDelete = (u: Utility) => {
    setSelectedUtility(u)
    setShowConfirm(true)
  }

  const confirmDelete = async (id: number) => {
    setShowConfirm(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/utilities/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Delete failed with status ${res.status}`);
      }
      console.log("Utility deleted successfully");

      window.location.reload();
    } catch (error) {
        console.error("Error deleting utility:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleSave = async (updated: Utility) => {
    const body = updated
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/utilities/update/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Update failed with status ${res.status}`);
      }
      

      console.log("Utility updated successfully");
      window.location.reload();

    } catch (error) {
      console.error("Error updating utility:", error);
    }

  }
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
        <div className="flex items-center gap-2">
          <AddUtilityButton />
          <Button variant="outline" size="icon" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
          
          
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
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                  <td className="px-6 py-4 text-sm text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                        onClick={() => handleEdit(u)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        onClick={() => handleDelete(u)} 
                        className="text-red-600 focus:text-red-700">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      {createTable(filteredUtility(meralco), "Meralco")}
      {createTable(filteredUtility(water), "Manila Water")}
      {selectedUtility && (
      <EditUtilityCard
        open={editOpen}
        onClose={() => {setEditOpen(false), setSelectedUtility(null)}}
        onSave={handleSave}
        utility={selectedUtility}
      />
      )}
      <FilterModal 
        open={filterOpen}
        onClose={() => {setFilterOpen(false)}}
        onApply={(newFilters) => {
          handleApplyFilters(newFilters);
          setFilterOpen(false);
        }}
        units={units}
      />
      {selectedUtility && <DeleteModal
        open={showConfirm}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={cancelDelete}
        onConfirm={() => confirmDelete(selectedUtility.id)}
      />}
      
      
    </div>
    
  );
}