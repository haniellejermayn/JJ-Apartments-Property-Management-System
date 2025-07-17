import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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


export default function AddUtilityButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [unitId, setUnitId] = useState<number>(0);
    const [type, setType] = useState("");
    const [currentReading, setCurrentReading] = useState<string>("");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [monthOfStart, setMonthOfStart] = useState<Date | undefined>(undefined);
    const [monthOfEnd, setMonthOfEnd] = useState<Date | undefined>(undefined);
    const [units, setUnits] = useState<Unit[]>([]);

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
            type,
            currentReading: Number(currentReading),
            dueDate: dueDate?.toISOString().split("T")[0],
            monthOfStart: monthOfStart?.toISOString().split("T")[0],
            monthOfEnd: monthOfEnd?.toISOString().split("T")[0],
            unitId: Number(unitId)
        }

        try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/utilities/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to create utility record");
      }

      setIsOpen(false);
      window.location.reload(); // Optional: reload to reflect changes

    } catch (error) {
      console.error("Error submitting utility:", error);
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
              <CardTitle>Add Utility Record</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="py-1 text-sm text-gray-900">
                    Type
                    <Select onValueChange={(value) => setType(value)}>
                        <SelectTrigger className="w-full h-11 rounded-md border px-3 text-left">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem key="Meralco" value="Meralco">
                                Meralco
                            </SelectItem>
                            <SelectItem key="Manila Water" value="Manila Water">
                                Manila Water
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
                    Current Reading
                    <Input
                        type="number"
                        placeholder="Current Reading"
                        value={currentReading}
                        onChange={(e) => setCurrentReading(e.target.value)}
                    />
                </div>

                <div className="py-1 text-sm text-gray-900">
                    Due Date
                    <DatePicker date={dueDate} setDate={setDueDate}/>
                </div>
                            
              <div className="grid gap-4 py-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="py-1 text-sm text-gray-900">
                          Month Of Start
                          <DatePicker date={monthOfStart} setDate={setMonthOfStart}/>
                      </div>

                      <div className="py-1 text-sm text-gray-900">
                          Month Of End
                          <DatePicker date={monthOfEnd} setDate={setMonthOfEnd}/>
                      </div>
                </div>
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