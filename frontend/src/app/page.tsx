

// import {
//   Bar,
//   BarChart,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
// } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CalendarIcon,
  ClipboardIcon,
} from 'lucide-react';

export default function Home() {

  const data = async () => {
    const response = await 
  }


  return (
    <div className="h-full flex-1 space-y-4 overflow-auto p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 pb-0">
              <CardTitle className="text-sm font-semibold">This month&apos;s Revenue</CardTitle>
              <CalendarIcon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-2xl font-semibold">₱{stats.monthRevenue}</div>
              <p className="text-muted-foreground flex gap-2 text-xs">
                {renderPercentChange(stats.monthRevenuePercentChange)} from last month
              </p>
            </CardContent>
          </Card>


        </div>

      </div>
      
    </div>
  );

}
