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
import {DatePicker} from "@/components/date-picker"
import { Payment } from "./payments-list";
interface Props {
  setPayment:  React.Dispatch<React.SetStateAction<Payment[]>>;
}

export default function AddPaymentButton({setPayment}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [unitId, setUnitId] = useState<number>(0);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [amount, setAmount] = useState<string>("");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [monthOfStart, setMonthOfStart] = useState<Date | undefined>(undefined);
    const [monthOfEnd, setMonthOfEnd] = useState<Date | undefined>(undefined);
    const [units, setUnits] = useState<Unit[]>([]);
    const modeOptions = ["Cash", "GCash", "Bank Transfer", "Online Payment", "Other"];
    const [error, setError] = useState<string | null>(null);


    const resetForm = () => {
      setUnitId(0);
      setAmount("");
      setDueDate(undefined);
      setModeOfPayment("");
      setMonthOfStart(undefined);
      setMonthOfEnd(undefined);
      setError(null);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`);
                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err?.error || "Failed to fetch units data.");
                }
                const data = await res.json();
            setUnits(data);
            } catch (error: any) {
              setError(error.message || "Failed to fetch data")
            }
        };
        fetchUnits();
    }, []);
    const handleSubmit = async(e: React.MouseEvent ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!unitId) {
          setError("Please select a unit.");
          return;
        }

        if (!modeOfPayment) {
          setError("Please select a mode of payment.");
          return;
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          setError("Please enter a valid amount greater than 0.");
          return;
        }
        
        if (!dueDate) {
          setError("Please select a due date.");
          return;
        }

        if (!monthOfStart) {
          setError("Please select a month of start.");
          return;
        }

        if (!monthOfEnd) {
          setError("Please select a month of end.");
          return;
        }

        const body = {
            unitId,
            modeOfPayment,
            amount: Number(amount),
            dueDate: dueDate?.toLocaleDateString("en-CA"),
            monthOfStart: monthOfStart?.toLocaleDateString("en-CA"),
            monthOfEnd: monthOfEnd?.toLocaleDateString("en-CA")
        }

        try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to create payment record.");
      }

      
      const saved = await res.json();
      setPayment(prev => [saved, ...prev]);
      handleClose();


    } catch (error:any) {
      setError(error.message || "Error submitting payment")
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
              <CardTitle>Add Payment Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-1 text-sm text-gray-900">
                Unit <span className="text-red-500">*</span>
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
                    Mode Of Payment <span className="text-red-500">*</span>
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
                  Amount <span className="text-red-500">*</span>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="py-1 text-sm text-gray-900">
                  Due Date <span className="text-red-500">*</span>
                  <DatePicker date={dueDate} setDate={setDueDate}/>
                </div>

                <div className="grid gap-4 py-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="py-1 text-sm text-gray-900">
                      Month Of Start <span className="text-red-500">*</span>
                      <DatePicker date={monthOfStart} setDate={setMonthOfStart}/>
                    </div>
                    <div className="py-1 text-sm text-gray-900">
                      Month Of End <span className="text-red-500">*</span>
                      <DatePicker date={monthOfEnd} setDate={setMonthOfEnd}/>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                    {error}
                  </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-4">
                <Button variant="secondary"
                  onClick={handleClose}
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