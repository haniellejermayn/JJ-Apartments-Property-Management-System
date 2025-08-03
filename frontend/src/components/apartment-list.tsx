import { Edit, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import EditUnitCard from "./edit-unit-card";
import { DeleteModal } from "./delete-modal";
import AddUnitButton from "./add-unit-button";
import { useDataRefresh } from '@/contexts/DataContext';

export type Unit = {
  id: number,
  unitNumber: string,
  name: string,
  description: string,
  numOccupants: number,
  contactNumber: string,
  price: number
}


export function ApartmentList() {
  const { refreshTrigger } = useDataRefresh();
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const cancelSearch = () => {
        setSearchTerm('');
        window.location.reload();
    }
    const handleEdit = (u: Unit) => {
      setSelectedUnit(u)
      setEditOpen(true)
    }
    const handleDelete = (u: Unit) => {
      setSelectedUnit(u)
      setShowConfirm(true)
    }
      
    const confirmDelete = async (id: number) => {
      setShowConfirm(false);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!res.ok) {
          throw new Error(`Delete failed with status ${res.status}`);
        }
        console.log("Unit deleted successfully");
  
        window.location.reload();
      } catch (error) {
        console.error("Error deleting unit:", error);
      }
    };
    
    const cancelDelete = () => {
      setShowConfirm(false);
    };
    
    const handleSave = async (updated: Unit) => {
        const body = updated
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/update/${updated.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
    
          if (!res.ok) {
            throw new Error(`Update failed with status ${res.status}`);
          }
    
          console.log("Unit updated successfully");
          window.location.reload();
        } catch (error) {
          console.error("Error updating unit:", error);
        }
    
      }

    const handleSearch = async (searchTerm: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/search?q=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) throw new Error("Something went wrong");
            const data = await response.json(); 
            setUnits(data);
        } catch (err) {
            console.error(err);
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US');
    };
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

    // Listen for refresh triggers from other components (like when tenants are added/removed)
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                console.log("Apartment list: Refreshing units due to trigger:", refreshTrigger);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`);
                const data = await res.json();
                console.log("Apartment list: Fetched units data:", data);
                setUnits(data);
                console.log("Apartment list: Units refreshed successfully");
            } catch (error) {
                console.error("Error fetching units:", error);
            }
        };
        // Trigger refresh on any change in refreshTrigger (except initial load)
        if (refreshTrigger > 0) {
            console.log("Apartment list: refreshTrigger changed to:", refreshTrigger, "- fetching units");
            fetchUnits();
        }
    }, [refreshTrigger]);

    useEffect(() =>{
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (searchTerm !== '') {
                    cancelSearch();
                }
            }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };

  }, [searchTerm])

  const createTable = (data: Unit[]) => {
    return (
        
        <div className="bg-white rounded-lg shadow-sm overflow-auto" ref={areaRef}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <h2 className="text-lg font-medium text-gray-900">Apartments</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Search:</span>
                        <input 
                        type="text"
                        className="px-3 py-1 border border-gray-300 rounded text-sm w-80"
                        placeholder="Search apartments..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            
                            handleSearch(searchTerm);
                        }
                        }}
                        />
                    </div>
                    
                    
                    
                </div>
                
                <div className="flex items-center gap-2">
                  <AddUnitButton/>
                  {/* <Button variant="outline" size="icon" onClick={() => setFilterOpen(true)}>
                    <SlidersHorizontal className="w-5 h-5" />
                  </Button> */}
                </div>
                </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit no, contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupants</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((apartment) => (
                <tr key={apartment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apartment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{apartment.unitNumber}</span>
                      <span className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800`}>
                        {apartment.contactNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apartment.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{apartment.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{apartment.numOccupants}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(apartment.price)}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                      onClick={() => handleEdit(apartment)}
                      className="inline-flex items-center px-3 py-1 bg-yellow-300 text-black text-xs rounded hover:bg-yellow-400 transition-colors border border-yellow-300 hover:border-yellow-400">
                        <Edit size={12} className="mr-1" />
                        Edit
                      </button>
                      <button 
                      onClick={() => handleDelete(apartment)}
                      className="inline-flex items-center px-3 py-1 bg-black text-yellow-300 text-xs rounded hover:text-yellow-400 transition-colors border border-black hover:border-black">
                        <Trash2 size={12} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{units.length}</span> entries
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">

      {createTable(units)}

      {selectedUnit && 
      <EditUnitCard
        open={editOpen}
        onClose={() => {setEditOpen(false), setSelectedUnit(null)}}
        onSave={handleSave}
        unit={selectedUnit}
      />
      }

      {selectedUnit && 
        <DeleteModal
        open={showConfirm}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={cancelDelete}
        onConfirm={() => confirmDelete(selectedUnit.id)}
        />}

        
      
    </div>
  );
};