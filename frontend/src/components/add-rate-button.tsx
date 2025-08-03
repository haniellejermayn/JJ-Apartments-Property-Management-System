
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

        if (!res.ok) throw new Error("Failed to create rate record");

        const savedRate = await res.json(); // return the full new rate including id
        setRates(prev => [savedRate, ...prev]);
    } catch (error) {
      console.error("Error submitting rate:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Rate Record</DialogTitle>
        </DialogHeader>

            <div className="py-1 text-sm text-gray-900">
              Rate
              <Input
                type="number"
                placeholder="Amount"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

            <div className="py-1 text-sm text-gray-900">
              Date
              <DatePicker date={date} setDate={setDate} />
            </div>

          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button onClick={handleSubmit} disabled={!rate || !date}>
                Submit
              </Button>
            </DialogTrigger>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
