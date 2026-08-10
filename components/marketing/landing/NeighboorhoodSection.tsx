"use client";

import { useState } from "react";
import Image from "next/image";
import { School, Utensils, Trees, Hospital, Gamepad2 } from "lucide-react";

const categories = [
  { name: "Schools", icon: School },
  { name: "Restaurants", icon: Utensils },
  { name: "Parks", icon: Trees },
  { name: "Hospitals", icon: Hospital },
  { name: "Playgrounds", icon: Gamepad2 },
];

interface Place {
  id: string;
  name: string;
  category: string;
  distance: string;
  image?: string;
}

export function NeighborhoodSection({ places }: { places: Place[] }) {
  const [activeCategory, setActiveCategory] = useState("Schools");

  const filtered = places.filter((p) => p.category === activeCategory);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-primary font-medium mb-2">NEIGHBORHOOD</p>
          <h2 className="text-4xl md:text-5xl font-bold">Nearby Amenities</h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need, just minutes away from your home.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((place) => (
            <div
              key={place.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden">
                {place.image ? (
                  <Image
                    src="/images/projects/school.jpg"
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-base">{place.name}</h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {place.distance} away
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="text-muted-foreground mt-6">
            No places found in this category.
          </p>
        )}
      </div>
    </section>
  );
}
