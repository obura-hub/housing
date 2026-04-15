"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFullProject } from "@/app/lib/actions/admin/projectActions";
import ProjectBasicInfo from "@/app/lib/actions/admin/wizard/ProjectBasicInfo";
import BlocksManager from "@/app/lib/actions/admin/wizard/BlocksManager";
import UnitTypesManager from "@/app/lib/actions/admin/wizard/UnitTypesManager";
import FloorsManager from "@/app/lib/actions/admin/wizard/FloorsManager";
import LayoutEditor from "@/app/lib/actions/admin/wizard/LayoutEditor";

export default function NewProjectWizard() {
  const [step, setStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: "",
    location: "",
    address: "",
    units: 0,
    price: "",
    description: "",
    longDescription: "",
    status: "ongoing",
    completionDate: "",
    developer: "",
    contactEmail: "",
    contactPhone: "",
    images: [] as string[],
  });
  const [blocks, setBlocks] = useState<any[]>([]);
  const [unitTypes, setUnitTypes] = useState<any[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const router = useRouter();

  const steps = [
    { title: "Basic Info", component: ProjectBasicInfo },
    { title: "Blocks", component: BlocksManager },
    { title: "Unit Types", component: UnitTypesManager },
    { title: "Floors", component: FloorsManager },
    { title: "Layout", component: LayoutEditor },
  ];

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

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

  const CurrentComponent = steps[step].component;

  let componentProps: any = {};

  if (step === 0) {
    componentProps = { data: projectData, updateData: setProjectData, next };
  } else if (step === 1) {
    componentProps = { data: blocks, updateData: setBlocks, next, prev };
  } else if (step === 2) {
    componentProps = { data: unitTypes, updateData: setUnitTypes, next, prev };
  } else if (step === 3) {
    componentProps = {
      data: { blocks, currentBlockIndex },
      updateData: (newBlock: any) => {
        const newBlocks = [...blocks];
        newBlocks[currentBlockIndex] = newBlock;
        setBlocks(newBlocks);
      },
      next,
      prev,
      blocks,
      currentBlockIndex,
      setCurrentBlockIndex,
    };
  } else if (step === 4) {
    componentProps = {
      data: { blocks, currentBlockIndex },
      updateData: ({
        blockIdx,
        floorIdx,
        cells,
      }: {
        blockIdx: number;
        floorIdx: number;
        cells: any[];
      }) => {
        const newBlocks = [...blocks];
        newBlocks[blockIdx].floors[floorIdx].cells = cells;
        setBlocks(newBlocks);
      },
      prev,
      submit: handleSubmit,
      isLast: true,
      blocks,
      currentBlockIndex,
      unitTypes, // Pass unit types to layout editor
    };
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center pb-2 border-b-2 ${
                idx <= step
                  ? "border-green-500 text-green-600"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {s.title}
            </div>
          ))}
        </div>
      </div>

      <CurrentComponent {...componentProps} />
    </div>
  );
}
