"use client";
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';




const ApartmentForm = () => {
  const [formData, setFormData] = useState({
    apartment: 'Dela Cruz Apartment',
    apartmentNo: '',
    description: '',
    price: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-80  bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Apartment Form</h2>
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

        <div className="pt-4 border-t border-gray-200">
          <button 
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add New Apartment
          </button>
        </div>
      </div>
    </div>
  );
};


const ApartmentList = () => {
  const apartments = [
    { id: 1, number: '#110', status: 'Not available', apartment: 'Dela Cruz Apartment', description: '2 bedroom and 1 rest room', price: '12,000.00' },
    { id: 2, number: '#111', status: 'Available', apartment: 'Dela Cruz Apartment', description: '3 bedroom and 1 rest room', price: '15,000.00' },
    { id: 3, number: '#111', status: 'Available', apartment: 'Dela Cruz Apartment', description: '1 bedroom and 1 rest room', price: '10,000.00' },
    { id: 4, number: '#110', status: 'Occupied', apartment: 'Dela Cruz Apartment', description: '2 bedroom and 1 rest room', price: '11,000.00' },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Apartment List</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Search:</span>
            <input 
              type="text" 
              className="px-3 py-1 border border-gray-300 rounded text-sm w-48"
              placeholder="Search apartments..."
            />
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment Unit</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apartments.map((apartment, index) => (
                <tr key={apartment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{apartment.number}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apartment.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : apartment.status === 'Not available'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apartment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apartment.apartment}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{apartment.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₱{apartment.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        <Edit size={12} className="mr-1" />
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
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
              Showing 1 to 4 of 4 entries
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b p-2 ">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Apartment Overview</h1>
        </div>
      </header>

      
      <div className="flex flex-1">
        <ApartmentForm />
        <ApartmentList />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="h-screen bg-gray-100">
      <MainContent />
    </div>
  );
};

export default App;