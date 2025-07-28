"use client";
import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import AddExpenseButton from '@/components/add-expense-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditExpenseCard from './edit-expense-card';
import FilterModal from './filter-modal';
import { DeleteModal } from './delete-modal';
import { SlidersHorizontal } from 'lucide-react';

export type Expense = {
    id: number,
    unitId: number,
    amount: number,
    modeOfPayment: string,
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
  const [editOpen, setEditOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{unit?: number, month?: String, year?: String}>({});
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  }

  const filteredExpense = (data : Expense[]) => {
    return data.filter((e) => {
    const date = new Date(e.date);
    const matchesUnit = !filters.unit || e.unitId == filters.unit;
    const matchesMonth = !filters.month || String(date.getMonth() + 1).padStart(2, "0") === filters.month;
    const matchesYear = !filters.year || String(date.getFullYear()) === filters.year;

    return matchesUnit && matchesMonth && matchesYear;
    })
  }
    
  const handleEdit = (e: Expense) => {
    setSelectedExpense(e)
    setEditOpen(true)
  }
  const handleDelete = (e: Expense) => {
    setSelectedExpense(e)
    setShowConfirm(true)
  }
  
  const confirmDelete = async (id: number) => {
    setShowConfirm(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Delete failed with status ${res.status}`);
      }
      console.log("Expense deleted successfully");

      window.location.reload();
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
  };

const cancelDelete = () => {
  setShowConfirm(false);
};

  // const handleDelete = async (id: number) => {
  //   try {
  //     if (!window.confirm("Are you sure you want to delete this record?")) return;
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${id}`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Delete failed with status ${res.status}`);
  //     }
  //     console.log("Expense deleted successfully");

  //     window.location.reload();
  //   } catch (error) {
  //       console.error("Error deleting expense:", error);
  //   }
  // }
  
  const handleSave = async (updated: Expense) => {
      const body = updated
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/update/${updated.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
        if (!res.ok) {
          throw new Error(`Update failed with status ${res.status}`);
        }
  
        console.log("Expense updated successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error updating expense:", error);
      }
  
    }
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
        <div className="flex items-center gap-2">
          <AddExpenseButton/>
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
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode Of Expense</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                  <td className="px-4 py-4 text-sm text-gray-900">{e.modeOfPayment}</td>
                  <td className="px-4 py-4 text-center text-sm text-gray-900">
                    {new Date(e.date).toLocaleDateString()}
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
                        onClick={() => handleEdit(e)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        onClick={() => handleDelete(e)} 
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

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="space-y-2">
      {createTable(filteredExpense(expenses))}
      {selectedExpense && (
        <EditExpenseCard
          open={editOpen}
          onClose={() => {setEditOpen(false), setSelectedExpense(null)}}
          onSave={handleSave}
          expense={selectedExpense}
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
      {selectedExpense && 
        <DeleteModal
          open={showConfirm}
          title="Delete Record"
          message="Are you sure you want to delete this record? This action cannot be undone."
          onCancel={cancelDelete}
          onConfirm={() => confirmDelete(selectedExpense.id)}
        />}
    </div>
  );
}