// app/dashboard/payments/PaymentActivityChartWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the chart component with ssr: false
const PaymentActivityChart = dynamic(() => import("./PaymentActivityChart"), {
  ssr: false,
  loading: () => (
    <div className="h-40 flex items-center justify-center text-muted-foreground">
      Loading chart...
    </div>
  ),
});

interface ChartData {
  [month: string]: number;
}

export default function PaymentActivityChartWrapper({
  data,
}: {
  data: ChartData;
}) {
  return <PaymentActivityChart data={data} />;
}
