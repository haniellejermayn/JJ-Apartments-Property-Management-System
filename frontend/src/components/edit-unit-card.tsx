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
        onSave(form)
        onClose()
    }

    const handleCancel = () => {
        setForm({ ...originalForm });
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
