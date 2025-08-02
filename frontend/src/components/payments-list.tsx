"use client";
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Unit } from '@/components/expenses-list'
import AddPaymentButton from "@/components/add-payment-button";
import EditPaymentCard from './edit-payment-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FilterModal from './filter-modal';
import { DeleteModal } from './delete-modal';
import { SlidersHorizontal } from 'lucide-react';
import { useDataRefresh } from '@/contexts/DataContext';

export type Payment = {
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
  const { triggerRefresh } = useDataRefresh();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{unit?: number, month?: String, year?: String}>({});
  const [showConfirm, setShowConfirm] = useState(false);
  

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  }

  const filteredPayments = (data : Payment[]) => {
    return data.filter((p) => {
    const date = new Date(p.paidAt);
    const matchesUnit = !filters.unit || p.unitId == filters.unit;
    const matchesMonth = !filters.month || String(date.getMonth() + 1).padStart(2, "0") === filters.month;
    const matchesYear = !filters.year || String(date.getFullYear()) === filters.year;

    return matchesUnit && matchesMonth && matchesYear;
    })
  }
  
  const handleEdit = (p: Payment) => {
    setSelectedPayment(p)
    setEditOpen(true)
  }
  const handleDelete = (p: Payment) => {
    setSelectedPayment(p)
    setShowConfirm(true)
  }
    
  const confirmDelete = async (id: number) => {
    setShowConfirm(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Delete failed with status ${res.status}`);
      }
      console.log("Payment deleted successfully");

      // Trigger refresh in other components
      triggerRefresh();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };
  
  const cancelDelete = () => {
    setShowConfirm(false);
  };
  
  const handleSave = async (updated: Payment) => {
      const body = updated
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/update/${updated.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
        if (!res.ok) {
          throw new Error(`Update failed with status ${res.status}`);
        }
  
        console.log("Payment updated successfully");
        // Trigger refresh in other components
        triggerRefresh();
        window.location.reload();
      } catch (error) {
        console.error("Error updating payment:", error);
      }
  
    }
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
        <div className="flex items-center gap-2">
          <AddPaymentButton/>
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
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode of Payment</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">For the Month Of</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid At</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                        onClick={() => handleEdit(p)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        onClick={() => handleDelete(p)} 
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

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="space-y-2">
      {createTable(filteredPayments(payments))}

      {selectedPayment && (
        <EditPaymentCard
          open={editOpen}
          onClose={() => {setEditOpen(false), setSelectedPayment(null)}}
          onSave={handleSave}
          payment={selectedPayment}
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
      {selectedPayment && 
        <DeleteModal
          open={showConfirm}
          title="Delete Record"
          message="Are you sure you want to delete this record? This action cannot be undone."
          onCancel={cancelDelete}
          onConfirm={() => confirmDelete(selectedPayment.id)}
      />}
    </div>
  );
}