import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import UnitSelectionClient from './UnitSelectionClient';
import { notFound } from 'next/navigation';

// Mock project data
const projectsData: Record<string, any> = {
  '105': {
    id: '105',
    name: 'Jogoo Road Lot 2 Estate',
    location: 'Jogoo Road, Nairobi County',
    unitTypes: '2 Bedroom • 3 Bedroom • 1 Room • 2 Room • 3 Room • Studio',
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
    ],
    units: [
      {
        id: '2B10995',
        type: '2 Bedroom',
        category: 'Affordable',
        price: 2000000,
        monthlyRepayment: 15100,
        area: 40.0,
        bedrooms: 2,
        bathrooms: 1,
        kitchens: 1,
      },
      {
        id: '3B10996',
        type: '3 Bedroom',
        category: 'Affordable',
        price: 3000000,
        monthlyRepayment: 22650,
        area: 60.0,
        bedrooms: 3,
        bathrooms: 2,
        kitchens: 1,
      },
      {
        id: 'ST10997',
        type: 'Studio',
        category: 'Affordable',
        price: 1000000,
        monthlyRepayment: 7550,
        area: 25.0,
        bedrooms: 0,
        bathrooms: 1,
        kitchens: 1,
      },
      {
        id: '1R10998',
        type: '1 Room',
        category: 'Affordable',
        price: 1200000,
        monthlyRepayment: 9060,
        area: 30.0,
        bedrooms: 1,
        bathrooms: 1,
        kitchens: 1,
      },
      {
        id: '2R10999',
        type: '2 Room',
        category: 'Affordable',
        price: 1800000,
        monthlyRepayment: 13590,
        area: 35.0,
        bedrooms: 2,
        bathrooms: 1,
        kitchens: 1,
      },
      {
        id: '3R11000',
        type: '3 Room',
        category: 'Affordable',
        price: 2500000,
        monthlyRepayment: 18875,
        area: 50.0,
        bedrooms: 3,
        bathrooms: 2,
        kitchens: 1,
      },
    ],
  },
  '106': {
    id: '106',
    name: 'Starehe Affordable Housing',
    location: 'Starehe, Nairobi County',
    unitTypes: '1 Bedroom • 2 Bedroom',
    units: [
      {
        id: '1B20001',
        type: '1 Bedroom',
        category: 'Affordable',
        price: 1200000,
        monthlyRepayment: 9060,
        area: 35.0,
        bedrooms: 1,
        bathrooms: 1,
        kitchens: 1,
      },
      {
        id: '2B20002',
        type: '2 Bedroom',
        category: 'Affordable',
        price: 2500000,
        monthlyRepayment: 18875,
        area: 50.0,
        bedrooms: 2,
        bathrooms: 1,
        kitchens: 1,
      },
    ],
  },
  '107': {
    id: '107',
    name: 'Woodley Affordable Housing',
    location: 'Nairobi County',
    unitTypes: '2 Bedroom • 3 Bedroom',
    units: [
      {
        id: '2B30001',
        type: '2 Bedroom',
        category: 'Affordable',
        price: 1000000,
        monthlyRepayment: 7550,
        area: 55.0,
        bedrooms: 2,
        bathrooms: 1,
        kitchens: 1,
      },
      {
        id: '3B30002',
        type: '3 Bedroom',
        category: 'Affordable',
        price: 1800000,
        monthlyRepayment: 13590,
        area: 75.0,
        bedrooms: 3,
        bathrooms: 2,
        kitchens: 1,
      },
    ],
  },
};

interface UnitSelectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UnitSelectionPage({ params }: UnitSelectionPageProps) {
  const { id } = await params;
  const project = projectsData[id];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <Sidebar projectId={id} />

        {/* Main Content */}
        <main className="ml-20 lg:ml-64 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UnitSelectionClient project={project} projectId={id} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
