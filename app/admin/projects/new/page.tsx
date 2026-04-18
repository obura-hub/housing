"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFullProject } from "@/lib/actions/admin/projectActions";
import ProjectDetails from "@/components/admin/wizard/ProjectBasicInfo";
import BlocksStep from "@/components/admin/wizard/BlocksManager";
import FloorsStep from "@/components/admin/wizard/FloorsManager";
import UnitTypesStep from "@/components/admin/wizard/UnitTypesManager";
import LayoutStep from "@/components/admin/wizard/LayoutEditor";
import ReviewStep from "@/components/admin/wizard/ReviewStep";

const steps = [
  { title: "Project Details", description: "Basic info & hero image" },
  { title: "Blocks", description: "Buildings / towers with images" },
  { title: "Floors", description: "Floor plans & dimensions" },
  { title: "Unit Types", description: "Room configurations & media" },
  { title: "Layout", description: "Assign unit types to units" },
  { title: "Review", description: "Confirm & create" },
];

export default function NewProjectWizard() {
  const [step, setStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    longDescription: "",
    status: "ongoing",
    completionDate: "",
    developer: "",
    contactEmail: "",
    contactPhone: "",
    images: [],
  });
  const [blocks, setBlocks] = useState<any[]>([]);
  const [unitTypes, setUnitTypes] = useState<any[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const router = useRouter();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    const result = await createFullProject({
      project: projectData,
      blocks,
      unitTypes,
    });
    if (result.success) {
      router.push(`/admin/projects/${result.projectId}`);
    } else {
      alert("Failed to create project. Check console for errors.");
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  const stepComponents = [
    <ProjectDetails
      key="details"
      data={projectData}
      updateData={setProjectData}
      next={next}
    />,
    <BlocksStep
      key="blocks"
      data={blocks}
      updateData={setBlocks}
      next={next}
      prev={prev}
    />,
    <FloorsStep
      key="floors"
      blocks={blocks}
      setBlocks={setBlocks}
      currentBlockIndex={currentBlockIndex}
      setCurrentBlockIndex={setCurrentBlockIndex}
      next={next}
      prev={prev}
    />,
    <UnitTypesStep
      key="unitTypes"
      data={unitTypes}
      updateData={setUnitTypes}
      next={next}
      prev={prev}
    />,
    <LayoutStep
      key="layout"
      blocks={blocks}
      setBlocks={setBlocks}
      unitTypes={unitTypes}
      next={next}
      prev={prev}
    />,
    <ReviewStep
      key="review"
      projectData={projectData}
      blocks={blocks}
      unitTypes={unitTypes}
      prev={prev}
      submit={handleSubmit}
    />,
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Housing Project</h1>
        <p className="text-muted-foreground">
          Add blocks, floor plans, unit types, and visual media
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>{stepComponents[step]}</CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          {step > 0 && (
            <Button variant="outline" onClick={prev}>
              Previous
            </Button>
          )}
          {step === steps.length - 1 ? (
            <Button onClick={handleSubmit}>Create Project</Button>
          ) : (
            <Button onClick={next}>Next Step</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
