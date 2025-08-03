
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { useDataRefresh } from "@/contexts/DataContext";
import { Rate } from "./utilities-list";

interface AddRateButtonProps {
  type: "Meralco" | "Manila Water";
  setRates:  React.Dispatch<React.SetStateAction<Rate[]>>;
}

export default function AddRateButton({ type, setRates }: AddRateButtonProps) {
  const [rate, setRate] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const resetForm = () => {
    setRate("");
    setDate(undefined);
    setError(null);
  };

  const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };
  const handleSubmit = async () => {
    const body = {
      type,
      rate: Number(rate),
      date: date?.toLocaleDateString("en-CA")
    };

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rates/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.error || "Failed to create rate record.");
        }

        const savedRate = await res.json(); // return the full new rate including id
        setRates(prev => [savedRate, ...prev]);
        handleClose();
    } catch (error: any) {
      setError(error.message || "Error submitting payment")
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Rate Record</DialogTitle>
        </DialogHeader>

            <div className="py-1 text-sm text-gray-900">
              Rate <span className="text-red-500">*</span>
              <Input
                type="number"
                placeholder="Amount"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

            <div className="py-1 text-sm text-gray-900">
              Date <span className="text-red-500">*</span>
              <DatePicker date={date} setDate={setDate} />
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            </DialogTrigger>
            <Button onClick={handleSubmit} disabled={!rate || !date}>
              Submit
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
