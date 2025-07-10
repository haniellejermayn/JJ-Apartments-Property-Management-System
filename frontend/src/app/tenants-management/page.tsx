"use client";
import React, { useState } from "react";
import { TenantPopUp } from "@/components/TenantPopUp";
import { TenantMgt } from "@/components/TenantMgt";

export default function TenantsManagementPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [tenants, setTenants] = useState([
        {
            id: 1,
            firstName: "Juan",
            middleName: "A",
            lastName: "Dela Cruz",
            email: "juan.delacruz@email.com",
            cpNo: "09123456789",
            dateAdded: new Date().toISOString()
        }
    ]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        
        if (modalOpen) {
            setEditingTenant(null);
        }
    };

    const generateId = () => {
        return tenants.length > 0 ? Math.max(...tenants.map(t => t.id)) + 1 : 1;
    };

    const handleAddTenant = (tenantData) => {
        const newTenant = {
            ...tenantData,
            id: generateId(),
            dateAdded: new Date().toISOString()
        };
        setTenants(prev => [...prev, newTenant]);
        console.log('New tenant added:', newTenant);
        toggleModal();
    };

    const handleEditTenant = (tenant) => {
        setEditingTenant(tenant);
        setModalOpen(true);
    };

    const handleUpdateTenant = (updatedData) => {
        setTenants(prev => 
            prev.map(tenant => 
                tenant.id === editingTenant.id 
                    ? { ...tenant, ...updatedData }
                    : tenant
            )
        );
        console.log('Tenant updated:', updatedData);
        toggleModal();
    };

    const handleDeleteTenant = (tenantId) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
            console.log('Tenant deleted:', tenantId);
        }
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        
        return phone;
    };

    const formatName = (firstName, middleName, lastName) => {
        const middle = middleName ? ` ${middleName}` : '';
        return `${firstName}${middle} ${lastName}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your property tenants ({tenants.length} total)
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                        >
                            Add Tenant
                        </button>
                    </div>
                </div>
            </header>

            
            <div className="px-6 py-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {tenants.length === 0 ? (
                        <div className="p-16 text-center bg-gradient-to-b from-gray-50 to-white">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tenants yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Get started by adding your first tenant to begin managing your property</p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Add Your First Tenant
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {tenants.map((tenant) => (
                                <div key={tenant.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-white font-semibold text-lg">
                                                        {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-900 transition-colors">
                                                        {formatName(tenant.firstName, tenant.middleName, tenant.lastName)}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            Active
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            ID: #{tenant.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                    <span className="font-medium text-gray-700">Email:</span>
                                                    <span className="text-gray-600">{tenant.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="font-medium text-gray-700">Phone:</span>
                                                    <span className="text-gray-600">{formatPhoneNumber(tenant.cpNo)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2 ml-6">
                                            <button
                                                onClick={() => handleEditTenant(tenant)}
                                                className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200 text-sm font-medium border border-blue-200 hover:border-blue-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTenant(tenant.id)}
                                                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200 text-sm font-medium border border-red-200 hover:border-red-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <TenantPopUp modalOpen={modalOpen}>
                <TenantMgt 
                    toggleModal={toggleModal} 
                    onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant}
                    editingTenant={editingTenant}
                    isEditing={!!editingTenant}
                />
            </TenantPopUp>
        </div>
    );
}