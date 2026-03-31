'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

type FloorId = 'ground' | '1' | '2' | '3' | '4' | '5';

const FLOORS: { id: FloorId; label: string; description: string }[] = [
  { id: 'ground', label: 'Ground Floor', description: 'Easy access and convenience' },
  { id: '1', label: '1st Floor', description: 'Great balance of access and view' },
  { id: '2', label: '2nd Floor', description: 'More privacy with a better view' },
  { id: '3', label: '3rd Floor', description: 'Quiet, elevated living experience' },
  { id: '4', label: '4th Floor', description: 'Excellent views and privacy' },
  { id: '5', label: '5th Floor', description: 'Top-floor comfort and best views' },
];

type FloorBookingState = Partial<Record<FloorId, number>>;

const STORAGE_KEY_PREFIX = 'unit-floor-bookings';

const makeStorageKey = (projectId: string, unitId: string) =>
  `${STORAGE_KEY_PREFIX}:${projectId}:${unitId}`;

const getUnitsPerFloor = (projectId: string): number => {
  switch (projectId) {
    // Example: customise per project ID when needed
    // case '105':
    //   return 12;
    // case '106':
    //   return 8;
    default:
      return 10;
  }
};

export default function UnitFloorSelectionPage({
  params,
}: {
  params: { id: string; unitId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFloor, setSelectedFloor] = useState<FloorId | null>(null);
  const [bookings, setBookings] = useState<FloorBookingState>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const key = makeStorageKey(params.id, params.unitId);
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as FloorBookingState) : {};
    } catch {
      return {};
    }
  });

  const unitPriceRaw = searchParams.get('price');
  const unitLabel = searchParams.get('unitLabel') ?? undefined;
  const unitPrice = unitPriceRaw ? Number(unitPriceRaw) : undefined;

  const selectedFloorLabel = useMemo(() => {
    if (!selectedFloor) return null;
    return FLOORS.find((f) => f.id === selectedFloor)?.label ?? null;
  }, [selectedFloor]);

  const unitsPerFloor = getUnitsPerFloor(params.id);
  const applyDisabled = !selectedFloor;

  const markFloorBooked = (floor: FloorId) => {
    const key = makeStorageKey(params.id, params.unitId);
    const updated: FloorBookingState = {
      ...bookings,
      [floor]: (bookings[floor] ?? 0) + 1,
    };
    setBookings(updated);
    try {
      window.localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const handleApply = () => {
    if (!selectedFloor) return;

    const bookedCount = bookings[selectedFloor] ?? 0;
    const availableBefore = Math.max(unitsPerFloor - bookedCount, 0);
    if (availableBefore <= 0) {
      return;
    }
    const unitNumber = availableBefore;

    markFloorBooked(selectedFloor);

    const qs = new URLSearchParams({ floor: selectedFloor, unitNumber: unitNumber.toString() });
    if (unitPrice != null && !Number.isNaN(unitPrice)) {
      qs.set('price', unitPrice.toString());
    }
    if (unitLabel) {
      qs.set('unitLabel', unitLabel);
    }

    router.push(
      `/project/${params.id}/units/${params.unitId}/apply/confirmation?${qs.toString()}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-10 lg:py-14 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  href={`/project/${params.id}/units`}
                  className="inline-flex items-center text-gray-600 hover:text-[#15B76C] transition-colors mb-2"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to units
                </Link>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Select Unit Floor
                </h1>
                <p className="text-gray-700 mt-2">
                  Choose a floor from <strong>Ground Floor</strong> to continue your application.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-500">Selected floor</p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedFloorLabel ?? 'None'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FLOORS.map((floor) => {
                const bookedCount = bookings[floor.id] ?? 0;
                const availableUnits = Math.max(unitsPerFloor - bookedCount, 0);
                const isBooked = availableUnits === 0;
                const isSelected = selectedFloor === floor.id;

                return (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => {
                      if (isBooked) return;
                      setSelectedFloor(floor.id);
                    }}
                    className={[
                      'group text-left rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow',
                      isSelected
                        ? 'border-[#15B76C] ring-2 ring-[#15B76C]/30'
                        : isBooked
                        ? 'border-gray-300 opacity-60 cursor-not-allowed'
                        : 'border-gray-200',
                    ].join(' ')}
                    aria-pressed={isSelected}
                    disabled={isBooked}
                  >
                    {/* Floor Picture Placeholder */}
                    <div className="h-40 bg-gradient-to-br from-[#15B76C]/15 to-[#0F854E]/25 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 border border-white shadow">
                            <svg className="w-6 h-6 text-[#0F854E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4 0V3m0 0l4 4m-4-4L8 7" />
                            </svg>
                          </div>
                          <p className="mt-3 font-semibold text-gray-900">{floor.label}</p>
                          <p className="text-xs text-gray-600">Floor preview image</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow border border-gray-200">
                          <svg className="w-5 h-5 text-[#15B76C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-600">{floor.description}</p>
                      <p className="mt-2 text-xs font-medium text-gray-700">
                        {availableUnits === 0 ? (
                          <span className="text-red-600">0 units available (Booked)</span>
                        ) : (
                          <>
                            {availableUnits} unit available on this floor
                          </>
                        )}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {isBooked ? 'Booked' : 'Select'}
                        </span>
                        <span
                          className={[
                            'text-xs px-2 py-1 rounded-full border transition-colors',
                            isBooked
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : isSelected
                              ? 'bg-[#15B76C]/10 text-[#0F854E] border-[#15B76C]/30'
                              : 'bg-gray-50 text-gray-600 border-gray-200 group-hover:bg-white',
                          ].join(' ')}
                        >
                          {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Tap to choose'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                {selectedFloorLabel
                  ? <>You selected <strong>{selectedFloorLabel}</strong>. You can now apply.</>
                  : 'Select a floor to enable the Apply button.'}
              </p>

              <button
                type="button"
                onClick={handleApply}
                disabled={applyDisabled}
                className={[
                  'px-8 py-3 rounded-lg font-semibold transition-colors',
                  applyDisabled
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#16a34a] text-white hover:bg-[#166534]',
                ].join(' ')}
              >
                Apply
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

