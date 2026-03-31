"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Home,
  Users,
  CreditCard,
  Calendar,
  Building,
  Ruler,
  BedDouble,
  Bath,
  CheckCircle,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { ProjectDetails } from "@/app/lib/types/projectsTypes";

interface ProjectDetailsContentProps {
  project: ProjectDetails;
}

export default function ProjectDetailsContent({
  project,
}: ProjectDetailsContentProps) {
  const [selectedImage, setSelectedImage] = useState(project.images[0] || "");

  // Helper to format price with KES symbol
  const formatPrice = (price: string) => {
    return price.startsWith("Ksh") ? price : `Ksh ${price}`;
  };

  console.log("project", project);

  return (
    <>
      {/* Hero Section with Main Image */}
      <section className="relative bg-gray-900">
        <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-emerald-900 flex items-center justify-center">
              <Building className="w-24 h-24 text-white/30" />
            </div>
          )}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
                {project.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="w-5 h-5" />
                <span>{project.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {project.images && project.images.length > 1 && (
          <div className="relative -mt-12 px-4 sm:px-6 lg:px-8 z-10">
            <div className="container mx-auto max-w-6xl">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {project.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      selectedImage === img
                        ? "ring-3 ring-green-500 shadow-lg scale-105"
                        : "ring-1 ring-white/30 hover:ring-green-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${project.name} - view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Detailed Information */}
              <div className="lg:col-span-2 space-y-12">
                {/* Project Overview */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    About {project.name}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p>{project.longDescription || project.description}</p>
                    <p className="mt-4">
                      This development is part of the Nairobi County Affordable
                      Housing Program, designed to provide quality, sustainable
                      homes with modern amenities and excellent connectivity to
                      the city.
                    </p>
                  </div>
                </div>

                {/* Key Highlights / Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                    <Home className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.units.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Units
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                    <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(project.price)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Starting Price
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.completionDate || "TBA"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Completion
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                    <Building className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.status}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </div>
                  </div>
                </div>

                {/* Unit Types – Selection Focus */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Available Unit Types
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {project.unitTypes.length} options
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.unitTypes.map((unit) => (
                      <div
                        key={unit.type}
                        className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {unit.type}
                            </h3>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                              {formatPrice(unit.price)}
                            </span>
                          </div>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Ruler className="w-4 h-4" />
                              <span className="text-sm">Size: {unit.size}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <BedDouble className="w-4 h-4" />
                              <span className="text-sm">
                                {unit.bedrooms} Bedroom
                                {unit.bedrooms !== 1 && "s"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Bath className="w-4 h-4" />
                              <span className="text-sm">
                                {unit.bathrooms} Bathroom
                                {unit.bathrooms !== 1 && "s"}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/projects/${project.id}/unit-types/${encodeURIComponent(unit.unitTypeId)}`}
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-green-700 hover:to-emerald-700 group/btn"
                          >
                            <span>Select This Unit</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {project.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Plans */}
                {project.paymentPlans.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Flexible Payment Plans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {project.paymentPlans.map((plan) => (
                        <div
                          key={plan.plan}
                          className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center"
                        >
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {plan.plan}
                          </h3>
                          <p className="text-green-600 dark:text-green-400 font-semibold text-sm mb-3">
                            {plan.discount}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {plan.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar – Sticky Project Info */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Project Info Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                      <h3 className="text-white font-bold text-lg">
                        Project Snapshot
                      </h3>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                        <span className="text-gray-500 dark:text-gray-400">
                          Status
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {project.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                        <span className="text-gray-500 dark:text-gray-400">
                          Total Units
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {project.units.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                        <span className="text-gray-500 dark:text-gray-400">
                          Starting Price
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(project.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                        <span className="text-gray-500 dark:text-gray-400">
                          Location
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white text-right">
                          {project.address}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                        <span className="text-gray-500 dark:text-gray-400">
                          Completion
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {project.completionDate || "TBA"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">
                          Developer
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {project.developer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Call to action – Browse Units (replaces old CTAs) */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 text-center border border-green-100 dark:border-gray-700">
                    <Home className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Ready to find your home?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Choose from our available unit types and secure your
                      future home today.
                    </p>
                    <Link
                      href="#unit-types"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      Browse Units
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section – Kept for context */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Location
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
              <div className="h-64 sm:h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                  <p className="text-lg font-semibold">{project.address}</p>
                  <p className="text-sm mt-2">
                    Interactive map would be embedded here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
