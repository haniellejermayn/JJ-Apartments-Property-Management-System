"use client";
import React, { useState } from "react";
import { TenantPopUp } from "@/components/TenantPopUp";
import { TenantMgt } from "@/components/TenantMgt";
export default function TenantsManagementPage() {
    type Unit = {
        id: number;
        unitNumber: string;
        occupied: boolean;
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [tenants, setTenants] = useState([]);
    const toggleModal = () => setModalOpen(!modalOpen);

    const handleAddTenant = (tenantData) => {
        setTenants([...tenants, { ...tenantData, id: 1 }]); // database
        console.log('New tenant added:', tenantData);
    };

    
    return (
        <div>
            <header className="bg-white shadow-sm border-b p-2 ">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
                    
                    <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors float-right"
                    >
                    Add Tenant
                    </button>
                    
                    
                </div>
                
            </header>
            
            <div className="flex flex-1">
                <TenantPopUp modalOpen={modalOpen}>
                    <TenantMgt toggleModal={toggleModal} onSubmit={handleAddTenant} />
                </TenantPopUp>
            </div>

            <div className="bg-white rounded-lg shadow flex items-center justify-center">
                tenant list to be put here  
            </div>
            
        </div>
    )
}