import { notFound } from "next/navigation";
import { getUnitDetails } from "@/app/lib/actions/unitActions";
import CheckoutClient from "@/components/checkout/CheckoutClient";

interface CheckoutPageProps {
  params: Promise<{ projectId: string; unitId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { projectId, unitId } = await params;
  const unit = await getUnitDetails(parseInt(unitId, 10));
  // if (!unit || unit.status !== "available") {
  //   notFound();
  // }
  // // Ensure projectId matches (optional)
  // if (unit.projectId !== parseInt(projectId, 10)) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CheckoutClient unit={unit} />
    </div>
  );
}
