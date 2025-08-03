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
import { Unit } from './expenses-list'
type Props = {
  open: boolean
  onClose: () => void
  onSave: (updated: any) => void
  unit: any // ideally Unit type
}

export default function EditUnitCard({ open, onClose, onSave, unit }: Props) {
    const [form, setForm] = useState<Unit>(() => ({ ...unit }));
    const [originalForm, setOriginalForm] = useState<Unit>(() => ({ ...unit }));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (open && unit) {
        setForm({ ...unit });
        setOriginalForm({ ...unit });
    }
    }, [open, unit]);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        onSave(form);
        onClose();
    }

    const handleCancel = () => {
        setForm({ ...originalForm });
    };

    const validateForm = () => {
        if (!form.name || !form.unitNumber || !form.contactNumber || form.numOccupants == null || form.price == null) {
            return "Please fill in all required fields.";
        }

        if (typeof form.numOccupants !== "number" || isNaN(form.numOccupants) || form.numOccupants < 0) {
            return "Number of occupants must be a non-negative number.";
        }

        if (typeof form.price !== "number" || isNaN(form.price) || form.price < 0) {
            return "Price must be a non-negative number.";
        }

        return null;
    };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
            <DialogTitle>Edit Unit Record</DialogTitle>
        </DialogHeader>
            <div className="grid gap-4 py-2">

                <div>
                    <Label className="py-1">Apartment Name</Label>
                        <Input
                        type="text"
                        value={form.name ?? ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        />
                </div>
                <div>
                    <Label className="py-1">Unit Number</Label>
                        <Input
                        type="text"
                        value={form.unitNumber ?? ""}
                        onChange={(e) => handleChange("unitNumber", e.target.value)}
                        />
                </div>
                <div>
                    <Label className="py-1">Contact Number</Label>
                        <Input
                        type="text"
                        value={form.contactNumber ?? ""}
                        onChange={(e) => handleChange("contactNumber", e.target.value)}
                        />
                </div>
                <div>
                    <Label className="py-1">Description</Label>
                        <Input
                        type="text"
                        value={form.description ?? ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="py-1">Number of Occupants</Label>
                        <Input
                            type="number"
                            value={form.numOccupants ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange("numOccupants", val === "" ? "" : Number(val));
                            }}
                            />
                    </div>
                    <div>
                        <Label className="py-1">Price</Label>
                        <Input
                            type="number"
                            value={form.price ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange("price", val === "" ? "" : Number(val));
                            }}
                            />
                    </div>
                </div>
                
                {error && (
                    <div className="text-sm text-red-600 bg-red-100 rounded px-3 py-2 mb-2">
                        {error}
                    </div>
                )}
            


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
