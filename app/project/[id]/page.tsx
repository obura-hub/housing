import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Mock project data - in a real app, this would come from an API or database
const projectsData: Record<string, any> = {
  '105': {
    id: '105',
    name: 'Park Road Affordable Housing Project',
    location: 'Nairobi, Kenya',
    address: 'Park Road, Nairobi',
    units: 1370,
    price: 'From KSh 1,500,000',
    description: 'Modern affordable housing units in the heart of Nairobi, designed to provide quality homes for low and middle-income earners.',
    longDescription: 'The Park Road Affordable Housing Project is a flagship development located in the heart of Nairobi. This project offers modern, well-designed housing units that are both affordable and of high quality. The development includes various unit types to suit different family sizes and needs.',
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
    ],
    unitTypes: [
      {
        type: 'Studio',
        size: '25 sqm',
        price: 'KSh 1,500,000',
        bedrooms: 0,
        bathrooms: 1,
      },
      {
        type: '1 Bedroom',
        size: '35 sqm',
        price: 'KSh 2,200,000',
        bedrooms: 1,
        bathrooms: 1,
      },
      {
        type: '2 Bedroom',
        size: '50 sqm',
        price: 'KSh 3,500,000',
        bedrooms: 2,
        bathrooms: 1,
      },
      {
        type: '3 Bedroom',
        size: '70 sqm',
        price: 'KSh 4,800,000',
        bedrooms: 3,
        bathrooms: 2,
      },
    ],
    amenities: [
      '24/7 Security',
      'Parking Spaces',
      'Water Supply',
      'Electricity',
      'Waste Management',
      'Recreational Areas',
      'Near Schools',
      'Near Hospitals',
      'Public Transport Access',
    ],
    paymentPlans: [
      {
        plan: 'Cash Payment',
        discount: '5% discount',
        description: 'Full payment upfront with a 5% discount',
      },
      {
        plan: 'Mortgage',
        discount: 'Up to 25 years',
        description: 'Financing through partner banks',
      },
      {
        plan: 'Rent-to-Own',
        discount: 'Flexible terms',
        description: 'Rent with option to purchase',
      },
    ],
    status: 'Under Construction',
    completionDate: 'Q4 2025',
    developer: 'National Housing Corporation',
    contact: {
      email: 'parkroad@bomayangu.go.ke',
      phone: '+254 700 000 000',
    },
  },
  '106': {
    id: '106',
    name: 'Starehe Affordable Housing',
    location: 'Nairobi, Kenya',
    address: 'Starehe, Nairobi',
    units: 1200,
    price: 'From KSh 1,200,000',
    description: 'Quality housing for low and middle-income earners in Nairobi.',
    longDescription: 'The Starehe Affordable Housing project provides quality homes for low and middle-income earners in Nairobi.',
    unitTypes: [
      {
        type: '1 Bedroom',
        size: '35 sqm',
        price: 'KSh 1,200,000',
        bedrooms: 1,
        bathrooms: 1,
      },
      {
        type: '2 Bedroom',
        size: '50 sqm',
        price: 'KSh 2,500,000',
        bedrooms: 2,
        bathrooms: 1,
      },
    ],
    amenities: [
      '24/7 Security',
      'Parking Spaces',
      'Water Supply',
      'Electricity',
    ],
    paymentPlans: [
      {
        plan: 'Cash Payment',
        discount: '5% discount',
        description: 'Full payment upfront',
      },
      {
        plan: 'Mortgage',
        discount: 'Up to 20 years',
        description: 'Bank financing available',
      },
    ],
    status: 'Planning',
    completionDate: 'Q2 2026',
    developer: 'National Housing Corporation',
    contact: {
      email: 'starehe@bomayangu.go.ke',
      phone: '+254 700 000 000',
    },
  },
  '107': {
    id: '107',
    name: 'Woodley Affordable Housing',
    location: 'Woodley, Nairobi',
    address: 'Woodley, Nairobi County',
    units: 1500,
    price: 'From KSh 1,000,000',
    description: 'Spacious units in a growing urban center.',
    longDescription: 'The Woodley Affordable Housing project offers spacious units in a growing urban center.',
    unitTypes: [
      {
        type: '2 Bedroom',
        size: '55 sqm',
        price: 'KSh 1,000,000',
        bedrooms: 2,
        bathrooms: 1,
      },
      {
        type: '3 Bedroom',
        size: '75 sqm',
        price: 'KSh 1,800,000',
        bedrooms: 3,
        bathrooms: 2,
      },
    ],
    amenities: [
      '24/7 Security',
      'Parking Spaces',
      'Water Supply',
      'Electricity',
      'Recreational Areas',
    ],
    paymentPlans: [
      {
        plan: 'Cash Payment',
        discount: '5% discount',
        description: 'Full payment upfront',
      },
      {
        plan: 'Mortgage',
        discount: 'Up to 25 years',
        description: 'Bank financing available',
      },
    ],
    status: 'Under Construction',
    completionDate: 'Q3 2025',
    developer: 'National Housing Corporation',
    contact: {
      email: 'woodley.go.ke',
      phone: '+254 700 000 000',
    },
  },
};

interface ProjectDetailsPageProps {
  params: {
    id: string;
  };
}




export default async function ProjectDetailsPage(props: {
  
  params?: Promise<{ id?: string }>;
}) {

  const params = await props.params;
  const id = params?.id || "";
  const project = projectsData[id]

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-[#15B76C] transition-colors">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/projects" className="text-gray-600 hover:text-[#15B76C] transition-colors">
                Projects
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{project.name}</span>
            </nav>
          </div>
        </section>

        {/* Hero Section with Image */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Main Image */}
              <div className="relative h-64 sm:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-[#15B76C] to-[#0F854E]">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{project.name}</h1>
                    <p className="text-xl sm:text-2xl">{project.location}</p>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {project.images.slice(0, 3).map((img: string, index: number) => (
                    <div
                      key={index}
                      className="relative h-32 sm:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {project.longDescription || project.description}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      This project is part of the Affordable Housing Program, designed to provide 
                      quality housing solutions for Kenyans. The development focuses on creating 
                      sustainable communities with modern amenities and excellent connectivity.
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-[#15B76C] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Modern Design</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-[#15B76C] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Quality Construction</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-[#15B76C] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Prime Location</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-[#15B76C] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Affordable Pricing</span>
                      </div>
                    </div>
                  </div>

                  {/* Unit Types */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Unit Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.unitTypes.map((unit: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-gray-900">{unit.type}</h4>
                            <span className="text-lg font-semibold text-[#15B76C]">{unit.price}</span>
                          </div>
                          <div className="space-y-2 text-gray-700">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>Size: {unit.size}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>{unit.bedrooms} Bedroom{unit.bedrooms !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                              </svg>
                              <span>{unit.bathrooms} Bathroom{unit.bathrooms !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {project.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-[#16a34a] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Plans */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {project.paymentPlans.map((plan: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 text-center">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.plan}</h4>
                          <p className="text-[#16a34a] font-semibold mb-3">{plan.discount}</p>
                          <p className="text-gray-600 text-sm">{plan.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    {/* Project Info Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Project Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <p className="font-semibold text-gray-900">{project.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Units</p>
                          <p className="font-semibold text-gray-900">{project.units.toLocaleString()} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Starting Price</p>
                          <p className="font-semibold text-[#16a34a] text-xl">{project.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Location</p>
                          <p className="font-semibold text-gray-900">{project.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                          <p className="font-semibold text-gray-900">{project.completionDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Developer</p>
                          <p className="font-semibold text-gray-900">{project.developer}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-[#16a34a] rounded-xl p-6 text-white mb-6">
                      <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm opacity-90 mb-1">Email</p>
                          <a href={`mailto:${project.contact.email}`} className="font-semibold hover:underline">
                            {project.contact.email}
                          </a>
                        </div>
                        <div>
                          <p className="text-sm opacity-90 mb-1">Phone</p>
                          <a href={`tel:${project.contact.phone}`} className="font-semibold hover:underline">
                            {project.contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Link
                        href={`/project/${params.id}/units`}
                        className="block w-full px-6 py-3 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold text-center"
                      >
                        Apply Now
                      </Link>
                      <Link
                        href="/contact"
                        className="block w-full px-6 py-3 bg-white text-[#15B76C] border-2 border-[#15B76C] rounded-lg hover:bg-green-50 transition-colors font-semibold text-center"
                      >
                        Request Info
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <div className="h-64 sm:h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-lg font-semibold">{project.address}</p>
                    <p className="text-sm mt-2">Map integration would go here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
