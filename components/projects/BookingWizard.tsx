"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Home,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";

interface BookingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
  blocks: any[];
  unitTypes: any[];
}

type Step = "block" | "unitType" | "floor" | "unit" | "confirm";

export function BookingWizard({
  open,
  onOpenChange,
  projectId,
  projectName,
  blocks,
  unitTypes,
}: BookingWizardProps) {
  // const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>("block");
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [selectedUnitType, setSelectedUnitType] = useState<any>(null);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [floorUnits, setFloorUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch floor units when floor changes
  useEffect(() => {
    if (selectedFloor && step === "unit") {
      const fetchFloor = async () => {
        setLoading(true);
        const res = await fetch(`/api/floors/${selectedFloor.id}`);
        const data = await res.json();
        setFloorUnits(data.units);
        setLoading(false);
      };
      fetchFloor();
    }
  }, [selectedFloor, step]);

  const resetWizard = () => {
    setStep("block");
    setSelectedBlock(null);
    setSelectedUnitType(null);
    setSelectedFloor(null);
    setSelectedUnit(null);
    setFloorUnits([]);
    setError(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetWizard();
      onOpenChange(false);
    }
  };

  const nextStep = () => {
    if (step === "block" && selectedBlock) setStep("unitType");
    else if (step === "unitType" && selectedUnitType) setStep("floor");
    else if (step === "floor" && selectedFloor) setStep("unit");
    else if (step === "unit" && selectedUnit) setStep("confirm");
  };

  const prevStep = () => {
    if (step === "unitType") setStep("block");
    else if (step === "floor") setStep("unitType");
    else if (step === "unit") setStep("floor");
    else if (step === "confirm") setStep("unit");
  };

  const submitBooking = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          unitId: selectedUnit.id,
          unitTypeId: selectedUnitType.id,
          blockId: selectedBlock.id,
          floorId: selectedFloor.id,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      onOpenChange(false);
      router.push("/dashboard/bookings?success=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ["block", "unitType", "floor", "unit", "confirm"];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Unit - {projectName}</DialogTitle>
          <Progress value={progress} className="mt-2" />
        </DialogHeader>

        <div className="py-4">
          {step === "block" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select a Block</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blocks.map((block) => (
                  <Card
                    key={block.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedBlock?.id === block.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedBlock(block)}
                  >
                    {block.image && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={block.image}
                          alt={block.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{block.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {block.description || "No description"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === "unitType" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose a Unit Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unitTypes.map((ut) => (
                  <Card
                    key={ut.type}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedUnitType?.type === ut.type ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedUnitType(ut)}
                  >
                    {ut.image && (
                      <div className="relative h-32 w-full">
                        <Image
                          src={ut.image}
                          alt={ut.type}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{ut.type}</h4>
                      <p className="text-sm">
                        {ut.size} | {ut.bedrooms} bed, {ut.bathrooms} bath
                      </p>
                      <p className="text-primary font-bold mt-1">{ut.price}</p>
                      <Badge
                        variant={
                          ut.availableUnits > 0 ? "default" : "destructive"
                        }
                        className="mt-2"
                      >
                        {ut.availableUnits} units available
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === "floor" && selectedBlock && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Select a Floor in {selectedBlock.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBlock.floors.map((floor: any) => (
                  <Card
                    key={floor.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedFloor?.id === floor.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedFloor(floor)}
                  >
                    {floor.floorPlanImage && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={floor.floorPlanImage}
                          alt={`Floor ${floor.floorNumber}`}
                          fill
                          className="object-contain rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h4 className="font-semibold">
                        Floor {floor.floorNumber}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {floor.rows} x {floor.cols} units
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === "unit" && selectedFloor && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Select Your Unit on Floor {selectedFloor.floorNumber}
              </h3>
              {loading ? (
                <p>Loading units...</p>
              ) : (
                <div className="overflow-x-auto">
                  <div
                    className="grid gap-2 justify-start"
                    style={{
                      gridTemplateColumns: `repeat(${selectedFloor.cols}, minmax(80px, 100px))`,
                    }}
                  >
                    {floorUnits.map((unit: any) => {
                      const isAvailable = unit.status === "available";
                      const isSelected = selectedUnit?.id === unit.id;
                      return (
                        <div
                          key={unit.id}
                          onClick={() => isAvailable && setSelectedUnit(unit)}
                          className={`aspect-square border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center p-1 text-center transition-all ${
                            isAvailable
                              ? isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:border-primary/50"
                              : "bg-muted border-muted-foreground/20 cursor-not-allowed opacity-50"
                          }`}
                        >
                          <div className="text-xs font-mono">
                            {unit.unitNumber}
                          </div>
                          {isAvailable ? (
                            <div className="text-[10px]">
                              {unit.unitTypeName}
                            </div>
                          ) : (
                            <div className="text-[10px]">Taken</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Confirm Your Booking</h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p>
                  <strong>Project:</strong> {projectName}
                </p>
                <p>
                  <strong>Block:</strong> {selectedBlock?.name}
                </p>
                <p>
                  <strong>Unit Type:</strong> {selectedUnitType?.type} -{" "}
                  {selectedUnitType?.price}
                </p>
                <p>
                  <strong>Floor:</strong> {selectedFloor?.floorNumber}
                </p>
                <p>
                  <strong>Unit Number:</strong> {selectedUnit?.unitNumber}
                </p>
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              {!session && (
                <p className="text-amber-600">
                  You need to sign in to book. Clicking continue will redirect
                  you.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step !== "block" && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            {step !== "confirm" ? (
              <Button
                onClick={nextStep}
                disabled={
                  step === "block"
                    ? !selectedBlock
                    : step === "unitType"
                      ? !selectedUnitType
                      : step === "floor"
                        ? !selectedFloor
                        : step === "unit"
                          ? !selectedUnit
                          : false
                }
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={submitBooking} disabled={submitting}>
                {submitting
                  ? "Submitting..."
                  : session
                    ? "Confirm Booking"
                    : "Sign In to Book"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
