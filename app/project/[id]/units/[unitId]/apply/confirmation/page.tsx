 'use client';

 import Header from '@/components/Header';
 import Footer from '@/components/Footer';
 import Link from 'next/link';
 import { useSearchParams } from 'next/navigation';

const floorLabel = (floor: string | undefined) => {
  switch (floor) {
    case 'ground':
      return 'Ground Floor';
    case '1':
      return '1st Floor';
    case '2':
      return '2nd Floor';
    case '3':
      return '3rd Floor';
    case '4':
      return '4th Floor';
    case '5':
      return '5th Floor';
    default:
      return null;
  }
};

const formatCurrency = (amount: number) =>
  `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

// Minimal copy of units data so we can resolve price/bedrooms from the unit page
const projectsData: Record<
  string,
  {
    id: string;
    units: { id: string; type: string; category: string; price: number; bedrooms: number }[];
  }
> = {
  '105': {
    id: '105',
    units: [
      { id: '2B10995', type: '2 Bedroom', category: 'Affordable', price: 2000000, bedrooms: 2 },
      { id: '3B10996', type: '3 Bedroom', category: 'Affordable', price: 3000000, bedrooms: 3 },
      { id: 'ST10997', type: 'Studio', category: 'Affordable', price: 1000000, bedrooms: 0 },
      { id: '1R10998', type: '1 Room', category: 'Affordable', price: 1200000, bedrooms: 1 },
      { id: '2R10999', type: '2 Room', category: 'Affordable', price: 1800000, bedrooms: 2 },
      { id: '3R11000', type: '3 Room', category: 'Affordable', price: 2500000, bedrooms: 3 },
    ],
  },
  '106': {
    id: '106',
    units: [
      { id: '1B20001', type: '1 Bedroom', category: 'Affordable', price: 1200000, bedrooms: 1 },
      { id: '2B20002', type: '2 Bedroom', category: 'Affordable', price: 2500000, bedrooms: 2 },
    ],
  },
  '107': {
    id: '107',
    units: [
      { id: '2B30001', type: '2 Bedroom', category: 'Affordable', price: 1000000, bedrooms: 2 },
      { id: '3B30002', type: '3 Bedroom', category: 'Affordable', price: 1800000, bedrooms: 3 },
    ],
  },
};

export default function UnitApplyConfirmationPage({
  params,
}: {
  params: { id: string; unitId: string };
}) {
  const searchParams = useSearchParams();

  const floorParam = searchParams.get('floor') ?? undefined;
  const unitNumberParam = searchParams.get('unitNumber');
  const priceParam = searchParams.get('price');
  const unitLabelFromUrl = searchParams.get('unitLabel') ?? undefined;

  const label = floorLabel(floorParam);

  const project = projectsData[params.id];
  const unit = project?.units.find((u) => u.id === params.unitId);

  const unitNumber =
    unitNumberParam && !Number.isNaN(Number(unitNumberParam))
      ? Number(unitNumberParam)
      : undefined;

  // Prefer explicit price in URL, fall back to unit definition
  const priceFromUrl = priceParam ? Number(priceParam) : undefined;
  const price =
    priceFromUrl && !Number.isNaN(priceFromUrl)
      ? priceFromUrl
      : unit?.price;

  const unitTypeFromBedrooms =
    unit?.bedrooms != null
      ? unit.bedrooms === 0
        ? 'Studio'
        : `${unit.bedrooms} Bedroom`
      : undefined;

  const unitLabel =
    unitTypeFromBedrooms ??
    unitLabelFromUrl ??
    (unit ? `${unit.type} (${unit.category})` : undefined);

  const deposit = price ? price * 0.1 : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#15B76C]/10 flex items-center justify-center border border-[#15B76C]/20">
                <svg className="w-6 h-6 text-[#0F854E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Booking Summary
                </h1>
                <p className="text-gray-700 mt-2">
                  {label ? (
                    <>
                      You have booked unit <strong>{params.unitId}</strong> on{' '}
                      <strong>{label}</strong>.
                    </>
                  ) : (
                    <>
                      No floor was selected. Please go back and choose a floor to continue.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Unit number</p>
                <p className="text-base font-semibold text-gray-900">
                  {unitNumber ?? params.unitId}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Floor</p>
                <p className="text-base font-semibold text-gray-900">
                  {label ?? 'Not selected'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Unit type</p>
                <p className="text-base font-semibold text-gray-900">
                  {unitLabel ?? 'Not specified'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Unit price</p>
                <p className="text-base font-semibold text-gray-900">
                  {price && !Number.isNaN(price) ? formatCurrency(price) : 'Not available'}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#15B76C]/5 border border-[#15B76C]/30 p-4">
              <p className="text-sm font-semibold text-gray-900">
                Deposit required before completing booking
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0F854E]">
                {deposit
                  ? formatCurrency(deposit)
                  : 'Deposit amount will be calculated once price is available.'}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                (Calculated as 10% of the unit price)
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link
                href={`/project/${params.id}/units/${params.unitId}/apply`}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold text-center"
              >
                Change floor
              </Link>
              <Link
                href="/#"
                className="px-6 py-3 rounded-lg bg-[#16a34a] text-white hover:bg-[#166534] transition-colors font-semibold text-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

