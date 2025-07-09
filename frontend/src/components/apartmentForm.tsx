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
    { id: 1, number: '#110', status: 'Not available', apartment: 'Dela Cruz Apartment', description: '2 bedroom and 1 rest room', price: '12,000.00' },
    { id: 2, number: '#111', status: 'Available', apartment: 'Dela Cruz Apartment', description: '3 bedroom and 1 rest room', price: '15,000.00' },
    { id: 3, number: '#111', status: 'Available', apartment: 'Dela Cruz Apartment', description: '1 bedroom and 1 rest room', price: '10,000.00' },
    // { id: 4, number: '#110', status: 'Occupied', apartment: 'Dela Cruz Apartment', description: '2 bedroom and 1 rest room', price: '11,000.00' },
  ]); // dummy data
  const [formData, setFormData] = useState({
      id: null,
      apartment: 'Dela Cruz Apartment',
      apartmentNo: '',
      description: '',
      price: '',
      status: 'Not available'
  });
  const [units, setUnits] = useState([]);
  const API_BASE_URL = 'http://localhost:8080/api/units';
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {

    setApartments((prev) => prev.filter((apt) => apt.id !== id));
  }

  const handleSubmit = (e) => {
    console.log(editingId);
    e.preventDefault();
    if (!editingId){
      const newApartment = {
          id: Math.max(...apartments.map(a => a.id), 0) + 1,
          number: formData.apartmentNo,
          status: formData.status,
          apartment: formData.apartment,
          description: formData.description,
          price: formData.price
      };
      setApartments([...apartments, newApartment]);
      console.log('Form submitted:', formData);
      setFormData({
        id: null,
        apartment: 'Dela Cruz Apartment',
        apartmentNo: '',
        description: '',
        price: '',
        status: ''
      });
    }
    else{
      setApartments(apartments.map(
        apt => apt.id == editingId ? 
        {
          ...apt,
          apartmentNo: formData.apartmentNo,
          apartment: formData.apartment,
          description: formData.description,
          price: formData.price,
          status: formData.status
        } : apt
      ));
      setFormData({
        id: null,
        apartment: 'Dela Cruz Apartment',
        apartmentNo: '',
        description: '',
        price: '',
        status: ''
      });

    }

    setEditingId(null);
  };

  const handleEdit = (apt) => {
    setFormData({
      id: apt.id,
      apartment: apt.apartment,
      apartmentNo: apt.number,
      description: apt.description,
      price: apt.price,
      status: apt.status,
    });
    setEditingId(apt.id);
  }

  useEffect(() => {
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
      } catch (error: any) {
        console.error('Error fetching data:', error);
      }
      

      
    }

    fetchUnits();
  }, []);

  const fetchUnits = async () => {
   
    
    // const response = await axios.get(API_BASE_URL);
    setUnits(response.data);
    
  };



  
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
            Select Apartment
          </label>
          <select 
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="Dela Cruz Apartment">Dela Cruz Apartment</option>
            <option value="Santos Apartment">Santos Apartment</option>
            <option value="Garcia Apartment">Garcia Apartment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment No.
          </label>
          <input 
            type="text"
            name="apartmentNo"
            value={formData.apartmentNo}
            onChange={handleInputChange}
            placeholder="e.g. #110"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupied
          </label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value='Not available'>No</option>
            <option value="Available">Yes</option>
            
          </select>
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
            Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₱</span>
            <input 
              type="number"
              name="price"
              value={formData.price}
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
    <ApartmentList apartments={apartments} onDelete={handleDelete} onEdit={handleEdit}/>
    </div>
  );

};