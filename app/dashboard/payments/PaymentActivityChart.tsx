// app/dashboard/payments/PaymentActivityChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  [month: string]: number;
}

export default function PaymentActivityChart({ data }: { data: ChartData }) {
  const chartData = Object.entries(data)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  if (chartData.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-muted-foreground">
        No payment data available for chart.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `Ksh ${value.toLocaleString()}`} />
          <Tooltip
            formatter={(value: number) => [
              `Ksh ${value.toLocaleString()}`,
              "Amount",
            ]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
