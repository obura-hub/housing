import { notFound } from "next/navigation";
import Link from "next/link";
import { getUnitsOnFloor } from "@/lib/actions/unitFloorActions";
import { getUnitType } from "@/lib/actions/unitTypeActions";
import FloorLayoutClient from "./FloorLayoutClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface FloorLayoutPageProps {
  params: Promise<{
    id: string;
    unitTypeId: string;
    floor: string;
  }>;
}

export default async function FloorLayoutPage({
  params,
}: FloorLayoutPageProps) {
  const { id, unitTypeId, floor: floorStr } = await params;
  const projectId = parseInt(id, 10);
  const typeId = parseInt(unitTypeId, 10);
  const floor = parseInt(floorStr, 10);

  if (isNaN(projectId) || isNaN(typeId) || isNaN(floor)) notFound();

  const unitType = await getUnitType(typeId);
  if (!unitType) notFound();

  const units = await getUnitsOnFloor(projectId, typeId, floor);
  if (units.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Floor {floor} - No Available Units
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              All units on this floor are currently booked.
            </p>
            <Link
              href={`/project/${projectId}/unit-types/${typeId}/floors`}
              className="mt-4 inline-block text-green-600"
            >
              ← Back to Floors
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-800">
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 py-10 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <Link
              href={`/project/${projectId}/unit-types/${typeId}/floors`}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Floors
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Floor {floor} – {unitType.type}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Select an available unit
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <FloorLayoutClient
              projectId={projectId}
              unitType={unitType}
              floor={floor}
              units={units}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
