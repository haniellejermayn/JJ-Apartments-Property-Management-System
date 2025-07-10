"use client";
import React, { useState, useEffect } from "react";
import { TenantPopUp } from "@/components/TenantPopUp";
import { TenantMgt } from "@/components/TenantMgt";
import { Mail, Phone, Building, DoorClosed  } from "lucide-react";

type Tenant = {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    unit: number;
    phoneNumber: string;
    dateAdded: string;
};

type Unit = {
    id: number;
    unitNumber: string;
    name: string;
};

export default function TenantsManagementPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>([]);

   
    const [units, setUnits] = useState<Unit[]>([]);
    
    useEffect(() => {
  
        const fetchUnits = async () => {
            try {
                const response = await fetch("/api/units");
                if (!response.ok) {
                    throw new Error("Failed to fetch units");
                }
                const data = await response.json();
                setUnits(data);
                console.log("Units loaded:", data);
            } catch (error) {
                console.error("Error fetching units:", error);
            }
        };

 
        const fetchTenants = async () => {
            try {
                const response = await fetch("/api/tenants"); 
                if (!response.ok) {
                    throw new Error("Failed to fetch tenants");
                }
                const data = await response.json();
                
                const processedTenants = data.map((tenant: Partial<Tenant>) => ({
                    ...tenant,
                    middleName: tenant.middleName,
                    dateAdded: tenant.dateAdded || new Date().toISOString()
                } as Tenant));
                
                setTenants(processedTenants);
                console.log("Tenants loaded:", processedTenants);
            } catch (error) {
                console.error("Error fetching tenants:", error);
            }
        };

        fetchUnits();
        fetchTenants();
    }, []);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        
        if (modalOpen) {
            setEditingTenant(null);
        }
    };

    const generateId = () => {
        return tenants.length > 0 ? Math.max(...tenants.map(t => t.id)) + 1 : 1;
    };

    const handleAddTenant = (tenantData: Omit<Tenant, 'id' | 'dateAdded'>) => {
        const newTenant: Tenant = {
            ...tenantData,
            id: generateId(),
            dateAdded: new Date().toISOString()
        };
        setTenants(prev => [...prev, newTenant]);
        console.log('New tenant added:', newTenant);
        toggleModal();
    };

    const handleEditTenant = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setModalOpen(true);
    };

    const handleUpdateTenant = (updatedData: Partial<Tenant>) => {
        if (editingTenant) {
            setTenants(prev => 
                prev.map(tenant => 
                    tenant.id === editingTenant.id 
                        ? { ...tenant, ...updatedData }
                        : tenant
                )
            );
            console.log('Tenant updated:', updatedData);
            toggleModal();
        }
    };

    const handleDeleteTenant = (tenantId: number) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
            console.log('Tenant deleted:', tenantId);
        }
    };

    const formatPhoneNumber = (phone: string) => {
        if (!phone) return 'N/A';
        return phone;
    };

    const formatName = (firstName: string, lastName: string, middleName?: string) => {
        const middle = middleName ? ` ${middleName}` : '';
        return `${firstName}${middle} ${lastName}`;
    };


    const getUnitInfo = (unitId: number) => {
        const unit = units.find(u => u.id === unitId);
        return {
            unitNumber: unit?.unitNumber || 'Unknown',
            buildingName: unit?.name || 'Unknown'
        };
    };

    // Note: We'll use the getUnitInfo function directly in the JSX

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
                            className="px-4 py-2 text-yellow-300 bg-black hover:text-yellow-400 rounded-lg transition-all duration-200 text-sm font-medium border border-black hover:border-black"
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
                                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-yellow-300 font-semibold text-lg">
                                                        {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-900 transition-colors">
                                                        {formatName(tenant.firstName, tenant.lastName, tenant.middleName)}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            Active
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex flex-wrap justify-between items-center text-sm bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-700">Email:</span>
                                                    <span className="text-gray-600">{tenant.email}</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-700">Phone:</span>
                                                    <span className="text-gray-600">{formatPhoneNumber(tenant.phoneNumber)}</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                                    <DoorClosed  className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-700">Unit:</span>
                                                    <span className="text-gray-600">{getUnitInfo(tenant.unit).unitNumber}</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-700">Building:</span>
                                                    <span className="text-gray-600">{getUnitInfo(tenant.unit).buildingName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2 ml-6">
                                            <button
                                                onClick={() => handleEditTenant(tenant)}
                                                className="px-4 py-2 text-black bg-yellow-300 hover:bg-yellow-400 rounded-lg transition-all duration-200 text-sm font-medium border border-yellow-300 hover:border-yellow-400"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTenant(tenant.id)}
                                                className="px-4 py-2 text-yellow-300 bg-black hover:text-yellow-400 rounded-lg transition-all duration-200 text-sm font-medium border border-black hover:border-black"
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