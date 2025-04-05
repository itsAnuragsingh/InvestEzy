import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banknote, TrendingUp, Wallet } from "lucide-react";

// Sample investments
const investments = [
  {
    platform: "Zerodha",
    amount: 50000,
    type: "Stocks",
    icon: <TrendingUp className="text-blue-600" />,
  },
  {
    platform: "MF Central",
    amount: 100000,
    type: "Mutual Funds",
    icon: <Wallet className="text-green-600" />,
  },
  {
    platform: "Angel One",
    amount: 30000,
    type: "Stocks",
    icon: <TrendingUp className="text-purple-600" />,
  },
];

// Utility functions
const formatCurrency = (num) =>
  `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function InvestmentDashboard() {
  // Calculations
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const stockValue = investments
    .filter((inv) => inv.type === "Stocks")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const mfValue = investments
    .filter((inv) => inv.type === "Mutual Funds")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📊 All Investments</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-3">
              <Banknote className="text-black" />
              <h2 className="text-lg font-semibold">Total Portfolio Value</h2>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-600" />
              <h2 className="text-lg font-semibold">Total Stock Value</h2>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stockValue)}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-3">
              <Wallet className="text-green-600" />
              <h2 className="text-lg font-semibold">Total Mutual Funds</h2>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(mfValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform-wise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((inv, idx) => (
          <Card key={idx} className="rounded-2xl shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                {inv.icon}
                <div>
                  <h2 className="text-xl font-semibold">{inv.platform}</h2>
                  <p className="text-sm text-gray-500">{inv.type}</p>
                </div>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(inv.amount)}</p>
              
            </CardContent>
          </Card>
           
           
        ))}
         

         
      </div>
      <div className="flex justify-center mt-17 w-1/2 mx-auto ">
  <Button  className={"w-1/3 bg-green-400"} >Buy More</Button>
</div>
    </div>
  );
}
