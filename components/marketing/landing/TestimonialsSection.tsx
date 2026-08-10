// components/marketing/TestimonialsSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jane Mwangi",
    role: "Homeowner, Pangani Estate",
    quote:
      "The process was seamless from registration to moving in. The county team was very supportive.",
    rating: 5,
  },
  {
    name: "John Otieno",
    role: "First-time Buyer",
    quote:
      "Affordable payment plans made it possible for me to own a home. Highly recommend.",
    rating: 5,
  },
  {
    name: "Mary Wanjiku",
    role: "Investor",
    quote:
      "Great quality and prime locations. The value appreciation has been excellent.",
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            What Our Residents Say
          </h2>
          <p className="mt-2 text-muted-foreground">
            Real stories from Nairobi homeowners.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-white shadow-md">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground italic">"{t.quote}"</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${idx < t.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <div className="mt-3">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
