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
    unit: string;
    phoneNumber: string;
    dateAdded: string;

};

type Unit = {
    id: number;
    unitNumber: string;
    name: string;
};
type TenantWithUnitDetails = Omit<Tenant, 'unit'> & {
    unit: Unit; 
};

export default function TenantsManagementPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<TenantWithUnitDetails | null>(null);
    const [tenants, setTenants] = useState<TenantWithUnitDetails[]>([]);

   
    const [units, setUnits] = useState<Unit[]>([]);
    
    
    useEffect(() => {
        fetchUnits();
    }, []); 

    
    useEffect(() => {
        if (units.length > 0) { 
            fetchTenants();
        }
    }, [units]);
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
            const rawTenants: TenantApiData[] = await response.json(); 
            
            const processedTenants: TenantWithUnitDetails[] = rawTenants.map(rawTenant => {
                const unitInfo = units.find(u => u.id === rawTenant.unit); 

                return {
                    ...rawTenant,
                    
                    unit: unitInfo ? unitInfo : { id: rawTenant.unit, name: 'Unknown Building', unitNumber: 'Unknown Unit' }
                };
            });
            
            setTenants(processedTenants);
            console.log("Tenants loaded:", processedTenants);
        } catch (error) {
            console.error("Error fetching tenants:", error);
        }
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        
        if (modalOpen) {
            setEditingTenant(null);
        }
    };


    const getUnit_id = async (unitName, unitNumber) => {
        try {
        console.log("DEBUG (Frontend): getUnit_id received - unitName:", unitName, ", unitNumber:", unitNumber);
        const encodedUnitName = unitName ? encodeURIComponent(unitName) : '';
        const encodedUnitNumber = unitNumber ? encodeURIComponent(unitNumber) : '';

        const url = `http://localhost:8080/api/units/findUnitId?name=${encodedUnitName}&unitNumber=${encodedUnitNumber}`;
        console.log("DEBUG (Frontend): Full URL being sent:", url);
        
        const res = await fetch(url);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'No specific error response from server.' }));
            console.error(`getUnit_id: Backend responded with ${res.status} error. StatusText: ${res.statusText}, ErrorData:`, errorData);
            
            if (res.status === 404 || res.status === 400) { 
                return null; 
            }
            throw new Error(`HTTP error! status: ${res.status} - ${errorData.message || res.statusText}`);
        }
        
        const data = await res.json();
        console.log("DEBUG (Frontend): getUnit_id Raw response data:", data);
        
        
        if (typeof data.id === 'number') {
            console.log("DEBUG (Frontend): getUnit_id Returning numeric ID:", data.id);
            return data.id;
        } else if (typeof data === 'number') { 
            console.log("DEBUG (Frontend): getUnit_id Raw response data was a number:", data);
            return data;
        } else {
            console.warn("DEBUG (Frontend): getUnit_id: 'id' property not found or not a number in API response, or data is not a bare number:", data);
            return null; 
        }
    } catch (e) {
        console.error("DEBUG (Frontend): getUnit_id: Caught error in try-catch:", e);
        return null; 
    }
        
        
    };

    const handleAddTenant = async (formData) => {
        const unitId = await getUnit_id(formData.unitName, formData.unitNum);
        if (unitId === null || unitId === undefined) {
            console.error('Error: Could not retrieve unit ID for the given unit name and number.');
            alert('Failed to add tenant: Unit not found or invalid unit details provided.');
            return; 
        }
        
        const tenantDataPayload = {
            firstName: formData.firstName,
            middleName: formData.middleName || null, 
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            unit: unitId 
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tenantDataPayload),
        })
        
        if (!res.ok){
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to add tenant: ${res.status} ${res.statusText} - ${errorData.message || ''}`);
        }
        toggleModal();
        fetchTenants();
    };

    const handleEditTenant = (tenant: TenantWithUnitDetails) => {
        setEditingTenant(tenant);
        setModalOpen(true);
    };

    const handleUpdateTenant = async (updatedData: any) => {
        if (editingTenant) {
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/update/${editingTenant.id}`,{
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            })


            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

            
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
                                                    <span className="text-gray-600">{getUnitInfo(tenant.unit.id).unitNumber}</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-700">Building:</span>
                                                    <span className="text-gray-600">{getUnitInfo(tenant.unit.id).buildingName}</span>
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