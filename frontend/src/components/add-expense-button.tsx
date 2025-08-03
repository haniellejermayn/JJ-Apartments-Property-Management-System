import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Unit } from "@/components/expenses-list"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/date-picker"
import { Expense } from "@/components/expenses-list";

interface Props {
  setExpense:  React.Dispatch<React.SetStateAction<Expense[]>>;
}

export default function AddExpenseButton({setExpense}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [unitId, setUnitId] = useState<number>(0);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [amount, setAmount] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [units, setUnits] = useState<Unit[]>([]);
    const modeOptions = ["Cash", "GCash", "Bank Transfer", "Online Payment", "Other"];
    const reasonOptions = ["Utility Bills", "Miscellaneous", "Maintenance"];
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`);
                const data = await res.json();
            setUnits(data);
            } catch (error) {
            console.error("Error fetching units:", error);
            }
        };
        fetchUnits();
    }, []);
    const handleSubmit = async(e: React.MouseEvent ) => {
        e.preventDefault();
        e.stopPropagation();

        const body = {
            unitId: Number(unitId),
            amount: Number(amount),
            modeOfPayment,
            reason,
            date: date?.toISOString().split("T")[0],
        }

        try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to create expense record");
      }

      setIsOpen(false);
      const saved = await res.json();
      setExpense(prev => [saved, ...prev]);

    } catch (error) {
      console.error("Error submitting expense:", error);
    }
    }

    return (
    <>
        <Button onClick={() => setIsOpen(true)}>
            Add
        </Button>

        {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-[600px] bg-card">
            <CardHeader>
              <CardTitle>Add Expense Record</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="py-1 text-sm text-gray-900">
                    Unit
                    <Select onValueChange={(value) => setUnitId(Number(value))}>
                        <SelectTrigger className="w-full h-11 rounded-md border px-3 text-left">
                            <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {units.map((u) => (
                            <SelectItem key={u.id} value={String(u.id)}>
                                Unit {u.unitNumber} - {u.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="py-1 text-sm text-gray-900">
                    Amount
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="grid gap-4 py-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="py-1 text-sm text-gray-900">
                            Mode Of Payment
                            <Select onValueChange={(value) => setModeOfPayment(value)}>
                                <SelectTrigger className="w-full h-11 rounded-md border px-3 text-left">
                                    <SelectValue placeholder="Select Mode of Payment" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {modeOptions.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="py-1 text-sm text-gray-900">
                            Reason
                            <Select onValueChange={(value) => setReason(value)}>
                                <SelectTrigger className="w-full h-11 rounded-md border px-3 text-left">
                                    <SelectValue placeholder="Select Reason" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {reasonOptions.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
              </div>


                <div className="py-1 text-sm text-gray-900">
                    Date
                    <DatePicker date={date} setDate={setDate}/>
                </div>
                            
              
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-4">
                <Button variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}