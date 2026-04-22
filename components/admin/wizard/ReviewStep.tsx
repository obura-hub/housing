"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface Props {
  projectData: any;
  blocks: any[];
  unitTypes: any[];
  prev: () => void;
  submit: () => void;
}

export default function ReviewStep({
  projectData,
  blocks,
  unitTypes,
  prev,
  submit,
}: Props) {
  const totalUnits = blocks.reduce((sum, block) => {
    return (
      sum +
      block.floors.reduce(
        (floorSum: number, floor: any) => floorSum + floor.cells.length,
        0,
      )
    );
  }, 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Name:</strong> {projectData.name}
          </p>
          <p>
            <strong>Location:</strong> {projectData.location}
          </p>
          <p>
            <strong>Address:</strong> {projectData.address}
          </p>
          <p>
            <strong>Status:</strong> {projectData.status}
          </p>
          <p>
            <strong>Developer:</strong> {projectData.developer || "N/A"}
          </p>
          {projectData.heroImage && (
            <div className="mt-2">
              <p className="mb-1">
                <strong>Hero Image:</strong>
              </p>
              <div className="relative h-32 w-48 rounded-lg overflow-hidden border">
                <Image
                  src={projectData.heroImage}
                  alt="Hero"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amenities */}
      {projectData.amenities && projectData.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {projectData.amenities.map((item: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Plans */}
      {projectData.paymentPlans && projectData.paymentPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectData.paymentPlans.map((plan: any, idx: number) => (
                <div key={idx} className="border-b pb-2">
                  <p className="font-semibold">{plan.plan}</p>
                  {plan.discount && (
                    <p className="text-sm text-primary">{plan.discount}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Blocks & Floors</CardTitle>
        </CardHeader>
        <CardContent>
          {blocks.map((block, idx) => (
            <div key={block.id} className="mb-4">
              <p className="font-semibold">{block.name}</p>
              <p className="text-sm text-muted-foreground">
                {block.description}
              </p>
              {block.image && (
                <div className="relative h-24 w-36 mt-2 rounded-lg overflow-hidden border">
                  <Image
                    src={block.image}
                    alt={block.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="ml-4 mt-2">
                <p className="text-sm">Floors: {block.floors.length}</p>
                <ul className="list-disc list-inside text-sm">
                  {block.floors.map((floor: any) => (
                    <li key={floor.id}>
                      Floor {floor.floorNumber} – {floor.rows}x{floor.cols}{" "}
                      units
                    </li>
                  ))}
                </ul>
              </div>
              {idx < blocks.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
          <p className="mt-2 font-medium">Total Units: {totalUnits}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unit Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitTypes.map((ut) => (
              <div key={ut.id} className="border rounded-lg p-3">
                <p className="font-semibold">{ut.type}</p>
                <p className="text-sm">
                  {ut.size} | {ut.price}
                </p>
                <p className="text-sm">
                  {ut.bedrooms} bed, {ut.bathrooms} bath
                </p>
                {ut.image && (
                  <div className="relative h-20 w-20 mt-2 rounded-md overflow-hidden border">
                    <Image
                      src={ut.image}
                      alt={ut.type}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
