import { notFound } from "next/navigation";
import { getUnitDetails } from "@/app/lib/actions/unitActions";
import { getCurrentUser } from "@/app/lib/actions/userActions";
import CheckoutClient from "@/components/checkout/CheckoutClient";

interface CheckoutPageProps {
  params: Promise<{ projectId: string; unitId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { projectId, unitId } = await params;
  const unit = await getUnitDetails(parseInt(unitId, 10));
  if (!unit) notFound();
  if (unit.status !== "available") notFound();

  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CheckoutClient unit={unit} user={user} />
    </div>
  );
}
