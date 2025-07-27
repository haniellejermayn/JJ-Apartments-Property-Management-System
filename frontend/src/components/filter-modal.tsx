'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    unit?: string;
    month?: string;
    year?: string;
  }) => void;
};

export default function FilterModal({ open, onClose, onApply }: FilterModalProps) {
  const [filterByUnit, setFilterByUnit] = useState(false);
  const [filterByMonth, setFilterByMonth] = useState(false);
  const [filterByYear, setFilterByYear] = useState(false);

  const [unit, setUnit] = useState("");
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
            <Input
              placeholder="Enter unit number"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          )}

          {/* Filter by Month */}
          <div className="flex items-center gap-2">
            <Checkbox id="month" checked={filterByMonth} onCheckedChange={(val) => setFilterByMonth(!!val)} />
            <label htmlFor="month" className="text-sm">Filter by Month</label>
          </div>
          {filterByMonth && (
            <select
              className="w-full border rounded px-2 py-1"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
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
