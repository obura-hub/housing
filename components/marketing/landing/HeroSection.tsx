"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    image: "/images/projects/woodly1.jpeg",
    title: "Modern Living in the Heart of Nairobi",
    description:
      "Experience urban renewal with affordable and sustainable housing backed by Nairobi City County.",
  },
  {
    image: "/images/narobi1.jpg",
    title: "Affordable Homes for Every Family",
    description:
      "Well-planned communities designed to provide comfort, accessibility, and dignity.",
  },
  {
    image: "/images/nairobi2.jpg",
    title: "Smart, Sustainable Communities",
    description:
      "Built with the future in mind—green spaces, efficient infrastructure, and modern amenities.",
  },
  {
    image: "/images/projects/woodly2.jpeg",
    title: "Invest in Your Future Today",
    description:
      "Secure your place in Nairobi’s growing housing developments with flexible ownership options.",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <Image
            key={index}
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className={`object-cover transition-all duration-[2000ms] ease-in-out ${
              index === current
                ? "opacity-100 scale-105"
                : "opacity-0 scale-100"
            }`}
          />
        ))}

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 w-full">
        <div key={current} className="max-w-xl text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight animate-fade-in-up">
            {slides[current].title}
          </h1>

          <p className="mt-4 text-lg text-white/90 animate-fade-in-up delay-200">
            {slides[current].description}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <Button
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Link href="/projects">Explore Projects</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <Link href="/register">Register Interest</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
