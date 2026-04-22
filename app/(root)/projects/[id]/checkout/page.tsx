// app/projects/[id]/checkout/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCheckoutDetails } from "@/lib/actions/checkoutActions";
import { CheckoutForm } from "./CheckoutForm";
import { Container } from "@/components/ui/container";
import {
  CheckCircle,
  Phone,
  Mail,
  Shield as ShieldIcon,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CheckoutPageProps {
  searchParams: Promise<{ unitId: string; unitTypeId: string }>;
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({
  searchParams,
  params,
}: CheckoutPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { unitId, unitTypeId } = await searchParams;
  const { id } = await params;
  const projectId = parseInt(id);
  const unit = await getCheckoutDetails(parseInt(unitId), parseInt(unitTypeId));
  if (!unit) redirect(`/projects/${projectId}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Container className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 md:space-x-8">
                <StepItem
                  number={1}
                  label="Select Unit"
                  active={false}
                  completed={true}
                />
                <StepConnector />
                <StepItem
                  number={2}
                  label="Review & Checkout"
                  active={true}
                  completed={false}
                />
                <StepConnector />
                <StepItem
                  number={3}
                  label="Payment"
                  active={false}
                  completed={false}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form Column */}
            <div className="lg:col-span-2">
              <CheckoutForm
                unit={unit}
                projectId={projectId}
                userId={session.user.id}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary Card */}
              <OrderSummaryCard unit={unit} />

              {/* Support Card */}
              <SupportCard />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// Step Indicator Components
function StepItem({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
          completed
            ? "bg-primary text-white"
            : active
              ? "bg-primary text-white ring-4 ring-primary/20"
              : "bg-muted text-muted-foreground",
        )}
      >
        {completed ? <CheckCircle className="h-4 w-4" /> : number}
      </div>
      <span
        className={cn(
          "text-xs mt-1 font-medium",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function StepConnector() {
  return <div className="w-8 md:w-16 h-0.5 bg-muted" />;
}

// Order Summary Card (Client-side dynamic? But we'll pass unit data)

function OrderSummaryCard({ unit }: { unit: any }) {
  const totalPrice = unit.total_price;
  return (
    <Card className="border-border/50 shadow-md sticky top-24">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Unit Price</span>
          <span className="font-medium">Ksh {totalPrice.toLocaleString()}</span>
        </div>
        {unit.price_adjustment !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Adjustment</span>
            <span
              className={
                unit.price_adjustment > 0 ? "text-red-600" : "text-green-600"
              }
            >
              {unit.price_adjustment > 0 ? "+" : ""}
              {unit.price_adjustment.toLocaleString()}
            </span>
          </div>
        )}
        <div className="border-t pt-3">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">
              Ksh {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-2 text-xs">
          <Shield className="h-4 w-4 text-primary mt-0.5" />
          <p className="text-muted-foreground">
            County-backed project. Your reservation is legally binding for 7
            days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Support Card
function SupportCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Need Assistance?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Our housing support team is ready to help.
        </p>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" /> +254 020 123456
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" /> housing@nairobi.go.ke
          </p>
        </div>
        <Button variant="link" className="p-0 h-auto text-primary" asChild>
          <Link href="/faq">View FAQ →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
