'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    console.log("DataContext: triggerRefresh called, current value:", refreshTrigger);
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log("DataContext: refreshTrigger updated from", prev, "to", newValue);
      return newValue;
    });
  };

  return (
    <DataContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataRefresh() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataRefresh must be used within a DataProvider');
  }
  return context;
}
