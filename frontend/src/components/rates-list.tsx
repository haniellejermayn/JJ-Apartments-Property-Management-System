"use client";
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FilterModal from './filter-modal';
import { DeleteModal } from './delete-modal';
import { SlidersHorizontal } from 'lucide-react';
import { Rate } from './utilities-list';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AddRateButton from './add-rate-button';
interface RatesListProps {
  open: boolean;
  type: 'Meralco' | 'Manila Water';
  onClose: () => void
}
export default function RatesList({open, type, onClose}: RatesListProps) {
    // const [meralco, setMeralco] = useState<Rate[]>([]);
    // const [water, setWater] = useState<Rate[]>([]);
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRate, setSelectedRate] = useState<Rate | null>(null);

  const handleDelete = (r: Rate) => {
    setSelectedRate(r)
    setShowConfirm(true)
  }
    
  const confirmDelete = async (id: number) => {
    setShowConfirm(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rates/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Delete failed with status ${res.status}`);
      }
      console.log("Rate deleted successfully");

      setRates(prev => prev.filter(rate => rate.id !== id));
    } catch (error: any) {
      console.error("Error deleting rate:", error);
      setError(error.message || 'Failed to delete data');
    }
  };
  
  const cancelDelete = () => {
    setShowConfirm(false);
  };
  
  useEffect(() => {
    if (!open) return;
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rates/type?type=${type}`);
        if (!res.ok) throw new Error(`Rates API error: ${res.status}`);

        const data = await res.json();
        setRates(data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [open, type]);

  
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
            <DialogHeader>
            <DialogTitle>{type} Rates</DialogTitle>
            </DialogHeader>

            {loading ? (
            <p>Loading...</p>
            ) : error ? (
            <p role="status" className="text-red-500">{error}</p>
            ) : (
            <div className="overflow-y-auto max-h-[60vh]">
                <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                    <th className="px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-4 text-sm text-gray-900"></th>
                    </tr>
                </thead>
                <tbody>
                    {rates.map((rate) => (
                    <tr key={rate.id} className="border-t">
                        <td className="px-4 py-2 text-sm text-gray-900">₱{rate.rate.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{new Date(rate.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        <Button variant="secondary" size="sm" onClick={() => handleDelete(rate)}>
                            Delete
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
            <DialogFooter>
                <AddRateButton type={type} setRates={setRates}/>
            </DialogFooter>
        </DialogContent>
        
        </Dialog>

        {selectedRate && <DeleteModal
        open={showConfirm}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={cancelDelete}
        onConfirm={() => confirmDelete(selectedRate.id)}
      />}
      
    </div>
  );
}