'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select"
import { Payment } from './payments-list'
import { Unit } from './expenses-list'
import { DatePicker } from './date-picker'
type Props = {
  open: boolean
  onClose: () => void
  onSave: (updated: any) => void
  payment: any // ideally Payment type
}

export default function EditPaymentCard({ open, onClose, onSave, payment }: Props) {
    const [form, setForm] = useState<Payment>(() => ({ ...payment }));
    const [units, setUnits] = useState<Unit[]>([]);
    const [originalForm, setOriginalForm] = useState<Payment>(() => ({ ...payment }));
    const modeOptions = ["Cash", "GCash", "Bank Transfer", "Online Payment", "Other"];

    useEffect(() => {
    if (open && payment) {
        setForm({ ...payment });
        setOriginalForm({ ...payment });
    }
    }, [open, payment]);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        onSave(form)
        onClose()
        window.location.reload();
    }

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


    const handleCancel = () => {
        setForm({ ...originalForm });
    };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
            <DialogTitle>Edit Payment Record</DialogTitle>
        </DialogHeader>
            <div className="grid gap-4 py-2">

                <div>
                    <Label className="py-1">Unit</Label>
                    <Select value={form.unitId?.toString() || ""} onValueChange={(value) => handleChange("unitId", value)}>
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
                <div>
                    <Label className="py-1">Mode Of Payment</Label>
                    <Select value={form.modeOfPayment?.toString() || ""} onValueChange={(value) => handleChange("modeOfPayment", value)}>
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
            <div >
                <Label className="py-1">Amount</Label>
                <Input
                    type="number"
                    value={form.amount ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        handleChange("amount", val === "" ? "" : Number(val));
                    }}
                    />
            </div>
        <div>
            <Label className="py-1">Due Date</Label>
            <DatePicker
                date={form.dueDate ? new Date(form.dueDate) : undefined}
                setDate={(selectedDate) =>
                    setForm((prev) => ({
                    ...prev,
                    dueDate: selectedDate ? selectedDate.toLocaleDateString('en-CA') : "",
                    }))
                }
            />
        </div>

          

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="py-1">Month Of Start</Label>
                    <DatePicker
                        date={form.monthOfStart ? new Date(form.monthOfStart) : undefined}
                        setDate={(date) =>
                        setForm(prev => ({
                        ...prev,
                        monthOfStart: date?.toLocaleDateString('en-CA') || ""
                        }))
                    }
                    />
                </div>
                
                <div>
                    <Label className="py-1">Month Of End</Label>
                    <DatePicker
                    date={form.monthOfEnd ? new Date(form.monthOfEnd) : undefined}
                    setDate={(date) =>
                        setForm(prev => ({
                        ...prev,
                        monthOfEnd: date?.toLocaleDateString('en-CA') || ""
                        }))
                    }
                />
                </div>
                
            </div>

        <div className="grid grid-cols-2 gap-4">
            
            <div>
              <Label className="py-1">Is Paid?</Label>
              <Select
                value={form.isPaid ? "yes" : "no"}
                onValueChange={(value) => handleChange("isPaid", value === "yes")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
                <Label className="py-1">Paid At</Label>
                <DatePicker
                    date={form.paidAt ? new Date(form.paidAt) : undefined}
                    setDate={(selectedDate) =>
                        setForm((prev) => ({
                            ...prev,
                            paidAt: selectedDate ? selectedDate.toLocaleDateString('en-CA') : "",
                        }))
                    }
                />
            </div>
        </div>
            


          </div>
        <DialogFooter>
          <Button variant="secondary"  
            onClick={() => {
                handleCancel();
                onClose();
            }}>
                Cancel
            </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    
  )
}
