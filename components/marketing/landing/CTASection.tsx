// components/marketing/CTASection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to Own Your Dream Home?
        </h2>
        <p className="mt-2 text-white/80 max-w-2xl mx-auto">
          Join thousands of Nairobi residents who have found their home through
          our county-backed program.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="bg-white text-primary hover:bg-gray-100"
          >
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
