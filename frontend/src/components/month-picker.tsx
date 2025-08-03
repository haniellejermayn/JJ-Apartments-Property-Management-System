import * as React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { format } from "date-fns";

const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]

export function MonthPicker({
  onConfirm,
}: {
  onConfirm: (date: Date) => void
}) {
  const [open, setOpen] = React.useState(false)
  const now = new Date()
    const [selectedMonth, setSelectedMonth] = React.useState<string>((now.getMonth() + 1).toString()) 
    const [selectedYear, setSelectedYear] = React.useState<string>(now.getFullYear().toString()) 

  const handleConfirm = () => {
    if (selectedMonth !== "" && selectedYear !== "") {
      const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1)
      onConfirm(date)
      setOpen(false)
    }
  }
  const monthNum = parseInt(selectedMonth);
  const formattedMonth = format(new Date(2000, monthNum - 1), "MMM"); 
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i) // 10-year range

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=" text-lg font-medium">{formattedMonth} {selectedYear}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Month & Year</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 py-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={selectedMonth === "" || selectedYear === ""}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
