"use client";
import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { DeleteModal } from './delete-modal';
import { NoReportDataModal } from './no-report-data-modal';
import { NoReportDeleteModal } from './no-report-delete-modal';
import { Plus } from 'lucide-react';
import { Unit } from './expenses-list';
import { MonthPicker } from './month-picker';

export type MonthlyReport = {
    id: number,
    month: number,
    year: number,
    unitId: number,
    monthlyDues: number,
    utilityBills: number,
    expenses: number
}

export default function ReportsList() {
    const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showNoReportModal, setShowNoReportModal] = useState(false);
    const [noReportMessage, setNoReportMessage] = useState("");
    const [showNoDeleteModal, setShowNoDeleteModal] = useState(false);
    const [noDeleteMessage, setNoDeleteMessage] = useState("");

    // Initialize selectedDate from localStorage or default to current date
    useEffect(() => {
        const savedDate = localStorage.getItem('selectedReportDate');
        if (savedDate) {
            setSelectedDate(new Date(savedDate));
        } else {
            setSelectedDate(new Date());
        }
    }, []);

    // Save selectedDate to localStorage whenever it changes
    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        localStorage.setItem('selectedReportDate', date.toISOString());
    };

 
    const handleDelete = () => {
        setShowConfirm(true)
    }
    
    const confirmDelete = async () => {
        if (!selectedDate) {
            console.error("No date selected");
            return;
        }
        setShowConfirm(false);
        try {
            const month = selectedDate.getMonth() + 1;
            const year = selectedDate.getFullYear();

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monthlyreports/delete?month=${month}&year=${year}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                if (res.status === 404) {
                    const errorText = await res.text();
                    setNoDeleteMessage(errorText || `No report found for ${month}/${year} to delete.`);
                    setShowNoDeleteModal(true);
                    return;
                } else {
                    throw new Error(`Delete failed with status ${res.status}`);
                }
            }
            
            console.log("MonthlyReport deleted successfully");
            // Instead of page reload, refresh the reports list by re-fetching data
            const updatedReports = await fetch(`/api/monthlyreports?month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`);
            if (updatedReports.ok) {
                const data = await updatedReports.json();
                setMonthlyReports(data);
            }
        } catch (error) {
            console.error("Error deleting monthlyReport:", error);
            setNoDeleteMessage("An unexpected error occurred while trying to delete the report. Please try again.");
            setShowNoDeleteModal(true);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    const handleGenerateReport = async () => {
        if (!selectedDate) {
            console.error("No date selected");
            return;
        }
        try {
            const month = selectedDate.getMonth() + 1;
            const year = selectedDate.getFullYear();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monthlyreports/add?month=${month}&year=${year}`, {
                method: "POST",
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (res.status === 409) {
                    setNoReportMessage(`A report for ${month}/${year} already exists.`);
                } else if (res.status === 400) {
                    setNoReportMessage(errorText || `Cannot generate report for ${month}/${year}. Please ensure all required data is available.`);
                } else {
                    setNoReportMessage(`Failed to generate report for ${month}/${year}. Please try again.`);
                }
                setShowNoReportModal(true);
                return;
            }

            let newReport
            if (res.headers.get("content-type")?.includes("application/json")) {
                newReport = await res.json();
                console.log("Report generated:", newReport);
            } else {
                const text = await res.text();
                console.warn("Server message:", text);
            }
            if (newReport) {
                setMonthlyReports([...monthlyReports, newReport]);
            }
            console.log("Report generated:", newReport);
            // Instead of page reload, refresh the reports list by re-fetching data
            const updatedReports = await fetch(`/api/monthlyreports?month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`);
            if (updatedReports.ok) {
                const data = await updatedReports.json();
                setMonthlyReports(data);
            }
        } catch (error) {
            console.error("Error generating report:", error);
            setNoReportMessage("An unexpected error occurred while generating the report. Please try again.");
            setShowNoReportModal(true);
        }
    };


    
    useEffect(() => {
        const fetchMonthlyReports = async () => {
        try {
            setLoading(true);
            setError(null);
        
            const [monthlyReportsRes, unitsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monthlyreports`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`),
            ])

            if (!monthlyReportsRes.ok) throw new Error(`MonthlyReports API error: ${monthlyReportsRes.status}`);
            if (!unitsRes.ok) throw new Error(`Units API error: ${unitsRes.status}`);
           
            const [monthlyReportsData, unitsData] = await Promise.all([
                monthlyReportsRes.json(),
                unitsRes.json(),
                
            ])
            setMonthlyReports(monthlyReportsData);
            setUnits(unitsData);
        } catch (error: unknown) {
            console.error('Error fetching data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
        };
        fetchMonthlyReports();
    }, []);

  const unitMap = useMemo(() => {
    const map = new Map<number, string>();
    units.forEach((u) => {
      map.set(u.id, `Unit ${u.unitNumber} - ${u.name}`);
    });
    return map;
  }, [units]);

  const createTable = (data: MonthlyReport[], month: number, year: number) => {
    const filteredData = data.filter(
        (report) => report.month === month && report.year === year
    );
    if (filteredData.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-6">
        <p className="text-lg font-medium">No report for this month.</p>
        <p className="text-sm mt-2">Create a report to get started.</p>
      </div>
    );
  }
    return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden m-4">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Monthly Reports</h2>
      </div>
      <div className="overflow-x-auto rounded shadow border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Dues</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utility Bills</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((e) => {
              const unitName = unitMap.get(e.unitId) || "—";
              return (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-4 text-sm text-gray-900">{unitName}</td>

                <td className="px-4 py-4 text-sm text-gray-900 text-right">
                    ₱{e.monthlyDues.toLocaleString() || 0}
                </td>
                
                <td className="px-4 py-4 text-sm text-gray-900 text-right">
                    ₱{e.utilityBills.toLocaleString() || 0}
                </td>
                
                <td className="px-4 py-4 text-sm text-gray-900 text-right">
                    ₱{e.expenses.toLocaleString() || 0}
                </td>
            

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    );
  }

  if (loading) return <p>Loading monthlyReports...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

 
  return (
    <div className="space-y-2">
        <div className = "flex justify-center mt-4">
        <MonthPicker onConfirm={(date) => {
            console.log("Picked:", date)
            handleDateChange(date);
        }}/>
        </div>
        

        {selectedDate &&
        createTable(
            monthlyReports,
            selectedDate.getMonth() + 1,
            selectedDate.getFullYear()
        )}
        <div className="fixed bottom-6 right-6 z-50 ">
        <Button variant="secondary" className="mr-2"
            onClick={() => handleDelete()}>
            Delete
        </Button>
        <Button
            onClick={handleGenerateReport}
            
        >
            <Plus/> Generate Report
        </Button>
        
        </div>
      
        <DeleteModal
        open={showConfirm}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onCancel={cancelDelete}
        onConfirm={() => confirmDelete()}
        />

        <NoReportDataModal
        open={showNoReportModal}
        message={noReportMessage}
        onClose={() => setShowNoReportModal(false)}
        />

        <NoReportDeleteModal
        open={showNoDeleteModal}
        message={noDeleteMessage}
        onClose={() => setShowNoDeleteModal(false)}
        />
    </div>
  );
}