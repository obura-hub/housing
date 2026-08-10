"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Apartment {
  id: string;
  title: string;
  type: string;
  image: string;
  units?: number;
  size?: string;
  price?: string;
}

export function ApartmentsComplexSection({
  apartments,
}: {
  apartments: Apartment[];
}) {
  if (!apartments.length) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-primary font-medium mb-2">APARTMENTS & COMPLEX</p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Explore Our Living Spaces
          </h2>
          <p className="mt-4 text-muted-foreground">
            Designed for comfort, community, and modern urban living.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apartments.map((apt) => (
            <div
              key={apt.id}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-[320px] w-full">
                <Image
                  src="/images/projects/woodly1.jpeg"
                  alt={apt.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 p-6 text-white w-full">
                <p className="text-sm uppercase tracking-wide text-white/70">
                  {apt.type}
                </p>

                <h3 className="text-xl font-semibold mt-1">{apt.title}</h3>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
                  {apt.size && <span>{apt.size}</span>}
                  {apt.units && <span>{apt.units} Units</span>}
                </div>

                {/* CTA */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition duration-500">
                  <Button
                    asChild
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    <Link href={`/apartments/${apt.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <Button asChild size="lg">
            <Link href="/apartments">View All Apartments</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
