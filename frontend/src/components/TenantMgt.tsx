import React, { useState } from "react";

export function TenantMgt({ toggleModal, onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        apartmentRented: '',
        apartmentUnit: ''
    });
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = () => {
        onSubmit(formData);
        toggleModal();
    };
    
    return (
        <div className="p-8 bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Add New Tenant</h2>
                    <p className="text-sm text-gray-600 mt-1">Enter tenant information below</p>
                </div>
                <button
                    onClick={toggleModal}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
                >
                    ×
                </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter middle name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                {/* Apartment Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apartment Rented *
                        </label>
                        <input
                            type="text"
                            name="apartmentRented"
                            value={formData.apartmentRented}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Juan Dela Cruz Apartment"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Number *
                        </label>
                        <input
                            type="text"
                            name="apartmentUnit"
                            value={formData.apartmentUnit}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., 101"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={toggleModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-medium"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium shadow-sm"
                >
                    Add Tenant
                </button>
            </div>
        </div>
    );
}