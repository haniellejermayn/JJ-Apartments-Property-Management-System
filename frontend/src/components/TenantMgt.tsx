import React, { useState, useEffect } from "react";

export function TenantMgt({ toggleModal, onSubmit, editingTenant, isEditing }) {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        unitName: '',
        unitNum: ''
    });

    // Populate form with editing data when editing
    useEffect(() => {
        console.log("TenantMgt: useEffect triggered.");
        console.log("TenantMgt: isEditing =", isEditing);
        console.log("TenantMgt: received editingTenant =", editingTenant); // <<<--- THIS ONE IS THE MOST IMPORTANT

        if (isEditing && editingTenant) {
            console.log("TenantMgt: Attempting to set formData with unit details:");
            console.log("  unitName (from editingTenant.unit.name):", editingTenant.unit?.name);
            console.log("  unitNum (from editingTenant.unit.unitNumber):", editingTenant.unit?.unitNumber);

            setFormData({
                firstName: editingTenant.firstName || '',
                middleName: editingTenant.middleName || '',
                lastName: editingTenant.lastName || '',
                email: editingTenant.email || '',
                phoneNumber: editingTenant.phoneNumber || '',
                unitName: editingTenant.unit?.name || '',       // <-- THIS IS THE CORRECT WAY
                unitNum: editingTenant.unit?.unitNumber || ''
            });
        } else {
            // Reset form when not editing
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                unitName: '',
                unitNum: ''
            });
        }
    }, [isEditing, editingTenant]);
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = () => {
        onSubmit(formData);
    };
    
    return (
        <div className="p-8 bg-white max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Tenant' : 'Add New Tenant'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isEditing ? 'Update tenant information below' : 'Enter tenant information below'}
                    </p>
                </div>
                <button
                    onClick={toggleModal}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
                >
                    ×
                </button>
            </div>

            <div className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., juan.delacruz@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cellphone Number *
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., 09123456789"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Building Name *
                        </label>
                        <input
                            type="text"
                            name="unitName"
                            value={formData.unitName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit no. *
                        </label>
                        <input
                            type="text"
                            name="unitNum"
                            value={formData.unitNum}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Z"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={toggleModal}
                    className="flex-1 px-6 py-3 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all font-medium"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-black text-yellow-300 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all font-medium shadow-sm"
                >
                    {isEditing ? 'Update Tenant' : 'Add Tenant'}
                </button>
            </div>
        </div>
    );
}