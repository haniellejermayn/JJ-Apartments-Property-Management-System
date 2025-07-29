'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select"
import { Unit } from "./expenses-list"


type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    unit?: number;
    month?: string;
    year?: string;
  }) => void;
  units: Unit[]
};

export default function FilterModal({ open, onClose, onApply, units }: FilterModalProps) {
  const [filterByUnit, setFilterByUnit] = useState(false);
  const [filterByMonth, setFilterByMonth] = useState(false);
  const [filterByYear, setFilterByYear] = useState(false);

  const [unit, setUnit] = useState(0);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleApply = () => {
    const filters: any = {};
    if (filterByUnit && unit) filters.unit = unit;
    if (filterByMonth && month) filters.month = month;
    if (filterByYear && year) filters.year = year;

    onApply(filters);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter by Unit */}
          <div className="flex items-center gap-2">
            <Checkbox id="unit" checked={filterByUnit} onCheckedChange={(val) => setFilterByUnit(!!val)} />
            <label htmlFor="unit" className="text-sm">Filter by Unit</label>
          </div>
          {filterByUnit && (
            <Select onValueChange={(value) => setUnit(Number(value))}>
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
          )}

          {/* Filter by Month */}
          <div className="flex items-center gap-2">
            <Checkbox id="month" checked={filterByMonth} onCheckedChange={(val) => setFilterByMonth(!!val)} />
            <label htmlFor="month" className="text-sm">Filter by Month</label>
          </div>
          {filterByMonth && (
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const m = String(i + 1).padStart(2, "0")
                  return (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )}

          {/* Filter by Year */}
          <div className="flex items-center gap-2">
            <Checkbox id="year" checked={filterByYear} onCheckedChange={(val) => setFilterByYear(!!val)} />
            <label htmlFor="year" className="text-sm">Filter by Year</label>
          </div>
          {filterByYear && (
            <Input
              placeholder="Enter year (e.g. 2025)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          )}

          <Button className="w-full mt-2" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
