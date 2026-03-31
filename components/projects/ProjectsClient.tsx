"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Search,
  Filter,
  X,
  Home,
  MapPin,
  Users,
  DollarSign,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Project } from "@/app/lib/types/projectsTypes";
import TermsAndConditionsModal from "../TermsAndConditionsModal";

interface ProjectsClientProps {
  initialProjects: Project[];
}

type PriceRange = "all" | "under-2m" | "2m-5m" | "5m-10m" | "over-10m";

export default function ProjectsClient({
  initialProjects,
}: ProjectsClientProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [minUnits, setMinUnits] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Check localStorage for terms acceptance on mount
  useEffect(() => {
    const accepted = localStorage.getItem("housing_terms_accepted");
    if (accepted === "true") {
      setTermsAccepted(true);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("housing_terms_accepted", "true");
    setTermsAccepted(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    router.push("/login");
  };

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    let filtered = [...initialProjects];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query),
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter((project) => {
        const price = parseFloat(project.price.replace(/[^0-9.-]+/g, ""));
        switch (priceRange) {
          case "under-2m":
            return price < 2000000;
          case "2m-5m":
            return price >= 2000000 && price <= 5000000;
          case "5m-10m":
            return price > 5000000 && price <= 10000000;
          case "over-10m":
            return price > 10000000;
          default:
            return true;
        }
      });
    }

    // Units filter
    if (minUnits > 0) {
      filtered = filtered.filter((project) => project.units >= minUnits);
    }

    return filtered;
  }, [initialProjects, searchQuery, priceRange, minUnits]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setMinUnits(0);
  };

  const hasActiveFilters = searchQuery || priceRange !== "all" || minUnits > 0;

  const priceRangeLabels: Record<PriceRange, string> = {
    all: "All Prices",
    "under-2m": "Under ₦2M",
    "2m-5m": "₦2M - ₦5M",
    "5m-10m": "₦5M - ₦10M",
    "over-10m": "Over ₦10M",
  };

  return (
    <>
      <TermsAndConditionsModal
        isOpen={showModal}
        onAccept={handleAccept}
        onCancel={handleCancel}
      />

      {termsAccepted && (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-20 lg:py-28">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Home className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium">
                    Affordable Housing Program
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                  Find Your Dream Home
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Explore affordable housing projects across Nairobi City.
                  Quality homes at prices you can afford.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-white">
                      {initialProjects.length}+ Projects
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-white">Flexible Payment Plans</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Search and Filters */}
              <div className="mb-12">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, location or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="mt-4 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price Range
                        </label>
                        <select
                          value={priceRange}
                          onChange={(e) =>
                            setPriceRange(e.target.value as PriceRange)
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        >
                          {Object.entries(priceRangeLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {/* Minimum Units */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minimum Units
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={minUnits || ""}
                          onChange={(e) =>
                            setMinUnits(Number(e.target.value) || 0)
                          }
                          placeholder="Any"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      {/* Clear Filters */}
                      {hasActiveFilters && (
                        <div className="flex items-end">
                          <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Clear all filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Results Count */}
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredProjects.length} of {initialProjects.length}{" "}
                  projects
                </div>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Home className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No projects found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-green-600 dark:text-green-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Home className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {project.name}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{project.location}</span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {project.units} units
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {project.price}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/projects/${project.id}`}
                          className="mt-5 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold group/btn"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
