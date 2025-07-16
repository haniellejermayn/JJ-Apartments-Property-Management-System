import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ApartmentList } from "./apartmentList";
// import axios from "axios";

export function ApartmentForm() {
  type Unit = {
    id: number;
    unitNumber: string;
    name: string;
    description: string;
    numOccupants: number;
    contactNumber: string;
  }
  const [apartments, setApartments] = useState([
    // { id: 1, number: '#110', status: 'Not available', apartment: 'Dela Cruz Apartment', description: '2 bedroom and 1 rest room', price: '12,000.00' },
    // { id: 2, number: '#111', status: 'Available', apartment: 'Dela Cruz Apartment', description: '3 bedroom and 1 rest room', price: '15,000.00' },
    // { id: 3, number: '#111', status: 'Available', apartment: 'Dela Cruz Apartment', description: '1 bedroom and 1 rest room', price: '10,000.00' },
    // { id: 4, number: '#110', status: 'Occupied', apartment: 'Dela Cruz Apartment', description: '2 bedroom and 1 rest room', price: '11,000.00' },
  ]); // dummy data
  const [formData, setFormData] = useState({
      id: null,
      unitNumber: '',
      name: '',
      description: '',
      numOccupants: '',
      contactNumber: ''
  });
  const [units, setUnits] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fetchUnits();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(editingId);
    e.preventDefault();
    if (!editingId){
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitNumber: formData.unitNumber,
          name: formData.name,
          description: formData.description,
          numOccupants: parseInt(formData.numOccupants) || 0,
          contactNumber: formData.contactNumber,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      fetchUnits();

      
      console.log('Form submitted:', formData);
      setFormData({
        id: null,
        unitNumber: '',
        name: '',
        description: '',
        numOccupants: '',
        contactNumber: ''
      });
    }
    else{
      // setApartments(apartments.map(
      //   apt => apt.id == editingId ? 
      //   {
      //     ...apt,
      //     unitNumber: formData.unitNumber,
      //     name: formData.name,
      //     description: formData.description,
      //     numOccupants: formData.numOccupants,
      //     contactNumber: formData.contactNumber
      //   } : apt
      // ));
      console.log(editingId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/update/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitNumber: formData.unitNumber,
          name: formData.name,
          description: formData.description,
          numOccupants: parseInt(formData.numOccupants) || 0,
          contactNumber: formData.contactNumber,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      fetchUnits();

      

      setFormData({
        id: null,
        unitNumber: '',
        name: '',
        description: '',
        numOccupants: '',
        contactNumber: ''
      });

    }

    setEditingId(null);
  };

  const handleEdit = (apt) => {
    setFormData({
      id: apt.id,
      unitNumber: apt.unitNumber,
      name: apt.name,
      description: apt.description,
      numOccupants: apt.numOccupants,
      contactNumber: apt.contactNumber
    });
    setEditingId(apt.id);
  }

  const fetchUnits = async () =>{
      try {
        const [unitsResponse] = await Promise.all([
          fetch('/api/units', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ]);

        const [unitsData] = await Promise.all([
          unitsResponse.json()
        ]);
        setApartments(unitsData);
        console.log(apartments);
      } catch (error: any) {
        console.error('Error fetching data:', error);
      }
      

      
  }

  useEffect(() => {
    

    fetchUnits();
  }, []);

  



  
  return (
    <div className="flex flex-1">

    <div className="w-80  bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2"> {editingId ? 'Edit' : 'Add'} Apartment Form</h2>
        <p className="text-sm text-gray-600">Add or edit apartment details</p>
      </div>

      <div className="space-y-6">   
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment name
          </label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Jason's apartment"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit No.
          </label>
          <input 
            type="text"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleInputChange}
            placeholder="e.g. #110"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact No.
          </label>
          <input 
            type="number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="e.g. 09121234440"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="1"
            placeholder="e.g. 2 bedroom and 1 rest room"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of occupants
          </label>
          <div className="relative">
          
            <input 
              type="number"
              name="numOccupants"
              value={formData.numOccupants}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save
          </button>
          <button 
            type="button"
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        
      </div>
    </div>
    <ApartmentList apartments={apartments} onDelete={handleDelete} onEdit={handleEdit} setApartments={setApartments} fetchUnits={fetchUnits}/>
    </div>
  );

};