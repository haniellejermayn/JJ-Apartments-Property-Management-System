import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Unit } from "@/components/expenses-list";
interface Props {
  setUnits:  React.Dispatch<React.SetStateAction<Unit[]>>;
}

export default function AddUnitButton({setUnits}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [unitNumber, setUnitNumber] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [contactNumber, setContactNumber] = useState<string>("");
    const [numOccupants, setNumOccupants] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    
    const handleSubmit = async(e: React.MouseEvent ) => {
        e.preventDefault();
        e.stopPropagation();

        const body = {
            unitNumber,
            name,
            description,
            price,
            numOccupants: Number(numOccupants),
            contactNumber: Number(contactNumber)
        }

        try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to create unit record");
      }

      setIsOpen(false);
      const savedUnit = await res.json();
      setUnits(prev => [savedUnit, ...prev]);

    } catch (error) {
      console.error("Error submitting unit:", error);
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
              <CardTitle >Add Unit Record</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 py-2">
                    <div>
                        <Label className="py-1">Apartment Name</Label>
                            <Input
                            type="text"
                            placeholder="Tanglewood Drive"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                    </div>
                    <div>
                        <Label className="py-1">Unit Number</Label>
                            <Input
                            type="text"
                            placeholder="G"
                            value={unitNumber}
                            onChange={(e) => setUnitNumber(e.target.value)}
                            />
                    </div>
                    <div>
                        <Label className="py-1">Description</Label>
                            <Input
                            type="text"
                            placeholder="Studio Apartment"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            />
                    </div>
                    <div>
                        <Label className="py-1">Contact Number</Label>
                            <Input
                            type="text"
                            placeholder="09123456789"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="py-1">Number of Occupants</Label>
                            <Input
                                type="number"
                                placeholder="2"
                                value={numOccupants}
                                onChange={(e) => setNumOccupants(e.target.value)}
                                />
                        </div>
                        <div>
                            <Label className="py-1">Price</Label>
                            <Input
                                type="number"
                                placeholder="15000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                />
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