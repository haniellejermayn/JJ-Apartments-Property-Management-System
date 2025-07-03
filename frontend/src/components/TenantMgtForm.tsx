import React, { useState } from "react";

export function TenantMgtForm() {

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

    const handleSubmit = (e) => {
    e.preventDefault();
        console.log('Form submitted:', formData);
    };
    return(
        <div className="w-80  bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label>
                        First name
                    </label>
                    <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label>
                        Middle name
                    </label>
                    <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label>
                        Last name
                    </label>
                    <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label>
                        Apartment rented
                    </label>
                    <input
                    type="text"
                    name="lastName"
                    value={formData.apartmentRented}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label>
                        Apartment unit
                    </label>
                    <input
                    type="text"
                    name="lastName"
                    value={formData.apartmentUnit}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Submit
                </button>

            </div>
            </form>
        </div>
    )
}