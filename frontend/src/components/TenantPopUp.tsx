import React from "react";
export function TenantPopUp({modalOpen, children}) {
    if (!modalOpen)
        return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    )
}