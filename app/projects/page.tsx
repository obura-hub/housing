'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import TermsAndConditionsModal from '@/components/TermsAndConditionsModal';
import Image from 'next/image';

export default function ProjectsPage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleAccept = () => {
    setTermsAccepted(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    router.push('/login');
  };

  const projects = [
    {
      id: '105',
      name: 'Park Road Project',
      location: 'Nairobi',
      units: '1,370 units',
      price: 'From KSh 1.5M',
      description: 'Modern affordable housing units in the heart of Nairobi',
      image: '/images/park.jpg' // ✅ Fixed: Use relative path from public folder
    },
    {
      id: '106',
      name: 'Starehe Affordable Housing',
      location: 'Nairobi',
      units: '1,200 units',
      price: 'From KSh 1.2M',
      description: 'Quality housing for low and middle-income earners',
      image: '/images/starehe.jpg' // Add image path
    },
    {
      id: '107',
      name: 'Woodley Affordable Housing',
      location: 'Nairobi',
      units: '1,500 units',
      price: 'From KSh 1.0M',
      description: 'Spacious units in a growing urban center',
      image: '/images/woodley.jpg' // Add image path
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {showModal && (
        <TermsAndConditionsModal onAccept={handleAccept} onCancel={handleCancel} />
      )}

      {termsAccepted && (
        <>
          <Header />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                    Available Projects
                  </h1>
                  <p className="text-xl text-gray-700">
                    Explore our affordable housing projects across Nairobi City
                  </p>
                </div>
              </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
                    >
                      {/* Fixed Image Component */}
                      <div className="relative h-48 bg-gradient-to-br from-[#15B76C] to-[#0F854E]">
                        <Image 
                          alt={project.name}
                          src={project.image}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                        </div>
                        <p className="text-gray-700 mb-4">{project.location}</p>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className="text-sm text-gray-500">{project.units}</span>
                          <span className="text-lg font-bold text-[#16a34a]">{project.price}</span>
                        </div>
                        <Link
                          href={`/project/${project.id}`}
                          className="block w-full mt-4 px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}
