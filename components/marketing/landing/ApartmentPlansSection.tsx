"use client";

import Image from "next/image";

interface Plan {
  id: string;
  title: string;
  blockImage: string;
  unitImage: string;
}

export function ApartmentPlansSection({ plans }: { plans: Plan[] }) {
  if (!plans.length) return null;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">VILLA PLANS</p>
          <h2 className="text-4xl md:text-5xl font-bold">Apartment Plans</h2>
        </div>

        {/* Plans Grid */}
        <div className="space-y-16">
          {plans.map((plan) => (
            <div key={plan.id}>
              {/* Title */}
              <h3 className="text-2xl font-semibold text-center mb-6">
                {plan.title}
              </h3>

              {/* Frame */}
              <div className="border-[6px] border-[#b07a56] p-6 md:p-10 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {/* Block Plan */}
                  <div className="relative w-full h-[200px] md:h-[260px]">
                    <Image
                      src={plan.blockImage}
                      alt={`${plan.title} block layout`}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Unit Plan */}
                  <div className="relative w-full h-[200px] md:h-[260px]">
                    <Image
                      src={plan.unitImage}
                      alt={`${plan.title} unit layout`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional subtle pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] [background-size:20px_20px]" />
    </section>
  );
}
