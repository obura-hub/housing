"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Unit {
  id: string;
  type: string;
  category: string;
  price: number;
  monthlyRepayment: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
}

interface ProjectData {
  id: number;
  name: string;
  location: string;
  images: string[];
  units: Unit[];
}

interface UnitSelectionClientProps {
  project: ProjectData;
  projectId: string;
}

export default function UnitSelectionClient({
  project,
  projectId,
}: UnitSelectionClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(
    {},
  );
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Generate unit types summary string from distinct unit types
  const unitTypesSummary = [...new Set(project.units.map((u) => u.type))].join(
    " • ",
  );

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const toggleWishlist = (unitId: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString("en-KE")}`;
  };

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + project.images.length) % project.images.length,
      );
    }
  };

  return (
    <>
      {/* Back Button and Project Header */}
      <div className="mb-6">
        <Link
          href={`/project/${projectId}`}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-4 transition-colors"
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
          Back
        </Link>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{project.location}</span>
          </div>

          <div className="flex items-center">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{unitTypesSummary}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Project Image */}
        <div className="lg:col-span-2">
          {project.images && project.images.length > 0 ? (
            <div className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 mb-6">
              <div className="aspect-video relative">
                <Image
                  src={project.images[selectedImageIndex]}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Navigation Arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors"
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-6 h-6 text-gray-700 dark:text-gray-300"
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
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors"
                      aria-label="Next image"
                    >
                      <svg
                        className="w-6 h-6 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(project.id.toString())}
                  className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${wishlist.has(project.id.toString()) ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"}`}
                    fill={
                      wishlist.has(project.id.toString())
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add to wishlist
                  </span>
                </button>
              </div>

              {/* Thumbnails */}
              {project.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {project.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                        selectedImageIndex === idx
                          ? "ring-2 ring-green-500"
                          : ""
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl aspect-video flex items-center justify-center mb-6">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-24 h-24 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">Project Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Available Units */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Available Units
            </h2>

            <div className="space-y-4">
              {project.units.map((unit) => (
                <div
                  key={unit.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Unit Header */}
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {unit.type} ({unit.category})
                        </h3>
                      </div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                        {formatCurrency(unit.price)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        *{formatCurrency(unit.monthlyRepayment)} monthly
                        repayments
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                        expandedUnits[unit.id] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* BOMA Code */}
                  <div className="px-4 pb-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded px-3 py-2">
                      <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                        BOMA CODE: {unit.id}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Unit Details */}
                  {expandedUnits[unit.id] && (
                    <div className="px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      {/* Specifications */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Area
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {unit.area} Sqm
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Bedroom
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {unit.bedrooms}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Bathroom
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {unit.bathrooms}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Kitchen
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {unit.kitchens}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Select Unit Button */}
                      <Link
                        href={{
                          pathname: `/project/${projectId}/units/${unit.id}/apply`,
                          query: {
                            price: unit.price.toString(),
                            unitLabel: `${unit.type} (${unit.category})`,
                          },
                        }}
                        className="block w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-semibold text-center"
                      >
                        Select Unit
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
