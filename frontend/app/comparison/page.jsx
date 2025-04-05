'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Info, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const fundData = {
  fundA: {
    name: "Alpha Growth Fund",
    trustScore: 4,
    risk: "Medium",
    returns: { initial: 10000, final: 12000 },
    highlights: ["Strong past performance", "Managed by top AMC"]
  },
  fundB: {
    name: "Beta Balanced Fund",
    trustScore: 3,
    risk: "Medium",
    returns: { initial: 10000, final: 11500 },
    highlights: ["Stable returns", "Low expense ratio"]
  },
};

const getRiskColor = (risk) => {
  if (risk === "Low") return "text-green-600";
  if (risk === "Medium") return "text-yellow-500";
  return "text-red-600";
};

export default function SmartComparison() {
  const [switched, setSwitched] = useState(false);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Sparkles className="text-purple-600 w-8 h-8" />
        AI Smart Fund Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {Object.entries(fundData).map(([key, fund]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="rounded-xl shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {fund.name} <Info className="w-4 h-4 text-gray-400" />
                </h2>

                <div className="flex items-center gap-2">
                  <p>Trust Score:</p>
                  {[...Array(fund.trustScore)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 w-5 h-5 fill-yellow-400"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <p>Safety Meter:</p>
                  <span
                    className={`font-bold ${getRiskColor(fund.risk)}`}
                  >
                    {fund.risk}
                  </span>
                </div>

                <p className="text-lg">
                  Returns: ₹{fund.returns.initial} → ₹{fund.returns.final} 📈
                </p>

                <ul className="list-disc list-inside text-sm text-gray-600">
                  {fund.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-purple-700">🤖 Recommendation</h3>
        <p className="text-gray-700">
          <strong>{fundData.fundA.name}</strong> is better than <strong>{fundData.fundB.name}</strong>: 
          <span className="text-green-600 font-semibold"> 15% returns</span>, 
          same risk level.
        </p>

        {switched ? (
          <motion.p
            className="text-green-700 font-semibold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            ✅ Switched to {fundData.fundA.name}!
          </motion.p>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => setSwitched(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Switch Now
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
