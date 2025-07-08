import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";


export function ApartmentList({apartments, onDelete, onEdit}){
  
  
  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Apartment List</h1>
        <div className="flex items-center justify-between">
          
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

        
      <div className="bg-white rounded-lg shadow-sm overflow-auto h-80">
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
                      <button 
                      onClick={() => onEdit?.(apartment)}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        <Edit size={12} className="mr-1" />
                        Edit
                      </button>
                      <button 
                      onClick={() => onDelete?.(apartment.id)}
                      className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
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
              <button 
              
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-gray-100">
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