"use client";

import { Home, Clock, Shield, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Home,
    title: "Smart Living",
    description:
      "Connected lifestyle with modern amenities and thoughtfully designed spaces.",
  },
  {
    icon: Shield,
    title: "Eco Construction",
    description:
      "Sustainable materials and environmentally conscious building practices.",
  },
  {
    icon: CheckCircle,
    title: "Prime Location",
    description:
      "Strategically located with easy access to key urban conveniences.",
    highlight: true,
  },
  {
    icon: Clock,
    title: "Modern Technology",
    description:
      "Integrated smart systems for comfort, efficiency, and security.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <div>
          <p className="text-primary font-medium mb-2">OUR ADVANTAGES</p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Our main property features
          </h2>

          <ul className="mt-6 space-y-3 text-muted-foreground">
            <li>• Social Hall</li>
            <li>• Early Childhood Development Centre</li>
            <li>• Daycare</li>
            <li>• Libraries</li>
            <li>• Media Rooms</li>
            <li>• Resident Lounges</li>
            <li>• Business Center</li>
            <li>• Rooftop Terraces</li>
          </ul>

          {/* Contact block */}
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Call experts</p>
              <p className="font-semibold">+254 (0) 117 300 300</p>
            </div>
          </div>

          <Button className="mt-6 px-6">Discover More</Button>
        </div>

        {/* RIGHT SIDE */}
        <div className="grid grid-cols-2 gap-6 relative">
          {features.map((feature, index) => {
            const isHighlight = feature.highlight;

            return (
              <div
                key={feature.title}
                className={`
                  relative p-6 rounded-2xl transition-all duration-500
                  ${
                    isHighlight
                      ? "bg-gray-900 text-white shadow-2xl col-span-1 row-span-2 flex flex-col justify-end"
                      : "bg-white shadow-md hover:shadow-xl"
                  }
                  ${index === 1 ? "mt-10" : ""}
                `}
              >
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-4
                    ${isHighlight ? "bg-white/10" : "bg-primary/10"}
                  `}
                >
                  <feature.icon
                    className={`h-5 w-5 ${
                      isHighlight ? "text-white" : "text-primary"
                    }`}
                  />
                </div>

                <h3 className="font-semibold text-lg">{feature.title}</h3>

                <p
                  className={`text-sm mt-2 ${
                    isHighlight ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {feature.description}
                </p>

                <span className="text-xs mt-4 inline-block opacity-70">
                  Read More →
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
