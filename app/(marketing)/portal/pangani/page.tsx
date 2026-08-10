// app/projects/woodley-village/page.tsx

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Home as HomeIcon,
  Users,
  Shield,
  Award,
  ArrowRight,
  Wifi,
  Leaf,
  Sparkles,
  Utensils,
  TreePine,
  ShoppingBag,
  Hospital,
  ToyBrick,
  Building2,
  Library,
  Briefcase,
  Sun,
  Baby,
  PartyPopper,
  CheckCircle,
  Phone,
} from "lucide-react";
import { VerifyEmployeeButton } from "@/components/custom/VerifyEmployeeButton";
import { auth } from "@/auth";

// Data remains the same...
const stats = [
  { value: "Luxury", label: "living experience", suffix: "" },
  { value: "Future", label: "building the future cities", suffix: "" },
  { value: "Winning", label: "architecture project", suffix: "" },
  { value: "Ample", label: "parking", suffix: "" },
  { value: "Premium", label: "well designed apartments", suffix: "" },
];

const propertyFeatures = [
  { icon: Building2, title: "Social Hall" },
  { icon: Baby, title: "Early Childhood Development Centre" },
  { icon: Baby, title: "Daycare" },
  { icon: Library, title: "Libraries" },
  { icon: PartyPopper, title: "Media Rooms" },
  { icon: Users, title: "Resident lounges in each court" },
  { icon: Briefcase, title: "Business Center" },
  { icon: Sun, title: "Rooftop Terraces" },
];

const valueProps = [
  {
    icon: Award,
    title: "Winning Architecture",
    desc: "We're here for look even you from start to finish.",
  },
  {
    icon: Wifi,
    title: "Smart living",
    desc: "Smart living at 300 Woodley Village offers a connected, convenient lifestyle with modern amenities, fostering community and effortless interaction.",
  },
  {
    icon: MapPin,
    title: "Attractive Location",
    desc: "300 Woodley Village boasts an attractive location, offering easy access to urban conveniences and natural beauty.",
  },
  {
    icon: Leaf,
    title: "Eco construction",
    desc: "300 Woodley Village features eco-friendly construction, blending sustainability with modern design for a greener future.",
  },
  {
    icon: Sparkles,
    title: "Modern technology",
    desc: "300 Woodley Village integrates modern technology, providing residents with smart homes and seamless, connected living experiences.",
  },
];

const apartmentPlans = [
  {
    name: "Studio Apartment",
    phase: "Apartments & Complex",
    desc: "The studio apartments at 300 Woodley Village provide sleek, open-concept living with smart space utilization and modern design.",
    beds: 0,
    baths: 1,
    sqft: "450-550",
    image: "/images/projects/woodly2.jpeg", // Added image path for Studio Apartment
  },
  {
    name: "One Bedroom",
    phase: "Phase 1",
    desc: "This cozy one-bedroom apartment offers efficient space, modern amenities, and a comfortable, minimalist design.",
    beds: 1,
    baths: 1,
    sqft: "650-750",
    image: "/images/projects/woodly3.jpeg",
  },
  {
    name: "Two Bedroom",
    phase: "Phase 1",
    desc: "This efficient two-bedroom apartment combines smart design with cozy spaces, perfect for comfortable and practical living.",
    beds: 2,
    baths: 1,
    sqft: "850-950",
    image: "/images/projects/yangu.jpeg",
  },
  {
    name: "Three Bedroom",
    phase: "Phase 1",
    desc: "This compact three-bedroom apartment maximizes space with smart layouts, offering comfort and functionality for modern living.",
    beds: 3,
    baths: 2,
    sqft: "105-115",
    image: "/images/projects/image3D.jpeg",
  },
  {
    name: "Two Bedroom",
    phase: "Phase 2",
    desc: "This spacious two-bedroom apartment offers open-plan living, elegant finishes, and ample room for relaxation and entertainment.",
    beds: 2,
    baths: 2,
    sqft: "850-950",
    image: "/images/projects/image3bd.jpeg",
  },
  {
    name: "Three Bedroom",
    phase: "Phase 2",
    desc: "This expansive three-bedroom apartment boasts generous living spaces, elegant design, and top-tier amenities for luxurious comfort.",
    beds: 3,
    baths: 2.5,
    sqft: "850-950",
    image: "/images/projects/image3D.jpeg",
  },
];

const neighborhoodSpots = [
  {
    icon: Utensils,
    name: "Restaurants",
    desc: "Enjoy diverse dining options with nearby restaurants offering a variety of cuisines to suit every taste.",
  },
  {
    icon: TreePine,
    name: "Parks",
    desc: "Explore the nearby park, featuring lush greenery, tranquil spaces, and inviting trails for outdoor enjoyment.",
  },
  {
    icon: ShoppingBag,
    name: "Shopping Center",
    desc: "The shopping center offers a range of stores, dining choices, and essential services for your convenience.",
  },
  {
    icon: Hospital,
    name: "Hospitals",
    desc: "The hospitals provide top-quality healthcare services, offering advanced medical treatments and compassionate care for all.",
  },
  {
    icon: ToyBrick,
    name: "Playgrounds",
    desc: "The playgrounds offer vibrant spaces for children to enjoy, featuring safe equipment and open areas for play.",
  },
];

const lifestyleFooter = [
  { main: "Luxury", sub: "Living" },
  { main: "Amenities", sub: "Buildings" },
  { main: "Center", sub: "downtown" },
  { main: "Contemporary", sub: "Lifestyle" },
];

export default async function WoodleyVillagePage() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section with Background Image */}
        <section className="relative overflow-hidden h-screen min-h-[600px] max-h-[800px] flex items-center">
          {/* Background Image - FIXED: Removed quality prop */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/projects/woodley.jpeg"
              alt="Woodley Village - Modern Luxury Apartments"
              fill
              priority
              className="object-cover"
              // Removed quality={100} - will use default (75)
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>

          <Container className="relative z-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
                Pangani Village
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Beautiful spaces in the best places
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <VerifyEmployeeButton
                  userId={userId}
                  redirectTo="/projects/woodley-village/register"
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-gray-100 shadow-lg text-base px-8"
                >
                  Register Interest
                </VerifyEmployeeButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:text-white text-base px-8"
                  asChild
                >
                  <Link href="#apartment-plans">View Plans</Link>
                </Button>
              </div>
            </div>
          </Container>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>

          {/* Wave SVG bottom - FIXED: Removed pattern-dots.svg reference causing 404 */}
          <div className="absolute bottom-0 left-0 w-full z-20">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-10 md:h-16"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28c70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08c36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                fill="white"
                opacity="0.9"
              ></path>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b border-gray-100">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl font-bold text-emerald-700">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* The Building Overview Section */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                >
                  The building overview
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-6">
                  Modern & premium apartments
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Welcome to 300 Woodley Village—an energetic community where
                  connections truly thrive. Here, the sense of belonging is
                  palpable, as neighbors quickly become like family.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Every corner of this village is designed to bring people
                  together, with shared spaces that naturally foster
                  interaction, from cozy parks perfect for impromptu gatherings
                  to vibrant communal areas where conversations flow freely.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Luxury living experience",
                    "Building the future cities",
                    "Winning architecture project",
                    "Ample parking",
                    "Well designed apartments",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* YOUR IMAGE ADDED HERE - Right side */}
              <div className="order-1 lg:order-2 relative h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/images/projects/woodly1.jpeg"
                  alt="Woodley Village modern apartment building - premium housing units"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  // quality={90}
                  priority
                />
                {/* Optional subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Property Features Grid - Redesigned */}
        <section className="py-20 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Property Features List */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-4">
                  Our main property features
                </h2>
                <Separator className="w-20 h-1 bg-emerald-500 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propertyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors duration-300">
                        {feature.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Contact & Social Section */}
              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-8 w-8 text-emerald-600" />
                    <h3 className="text-2xl font-bold text-slate-800">
                      Winning Architecture
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We're here for look even you from start to finish.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">
                      Call experts
                    </span>
                  </div>
                  <a
                    href="tel:+254700000000"
                    className="text-2xl font-bold text-emerald-700 hover:text-emerald-800 transition-colors block mb-4"
                  >
                    +254 70000000000
                  </a>
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    DISCOVER MORE <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Eco Construction Preview */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                    <h4 className="text-lg font-semibold text-slate-800">
                      Eco construction
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    300 Woodley Village features eco-friendly construction,
                    blending sustainability with modern design for a greener
                    future.
                  </p>
                  <Button
                    variant="link"
                    className="text-emerald-600 px-0 hover:text-emerald-700"
                  >
                    Read More <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {/* Smart Living Preview */}
                <div className="border-t border-gray-200 pt-6 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Wifi className="h-6 w-6 text-emerald-600" />
                    <h4 className="text-lg font-semibold text-slate-800">
                      Smart living
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Smart living at 300 Woodley Village offers a connected,
                    convenient lifestyle with modern amenities, fostering
                    community and effortless interaction.
                  </p>
                  <Button
                    variant="link"
                    className="text-emerald-600 px-0 hover:text-emerald-700"
                  >
                    Read More <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {/* Modern Technology Preview */}
                <div className="border-t border-gray-200 pt-6 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                    <h4 className="text-lg font-semibold text-slate-800">
                      Modern technology
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    300 Woodley Village integrates modern technology, providing
                    residents with smart homes and seamless, connected living
                    experiences.
                  </p>
                  <Button
                    variant="link"
                    className="text-emerald-600 px-0 hover:text-emerald-700"
                  >
                    Read More <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {/* Attractive Location Preview */}
                <div className="border-t border-gray-200 pt-6 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                    <h4 className="text-lg font-semibold text-slate-800">
                      Attractive Location
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    300 Woodley Village boasts an attractive location, offering
                    easy access to urban conveniences and natural beauty.
                  </p>
                  <Button
                    variant="link"
                    className="text-emerald-600 px-0 hover:text-emerald-700"
                  >
                    Read More <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Apartment Plans Section  */}
        <section id="apartment-plans" className="py-20 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-4">
                Apartment plans
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose your perfect home from our thoughtfully designed layouts.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartmentPlans.map((plan, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all group"
                >
                  {/* Conditional Image Display - Shows image for Studio Apartment, gradient for others */}
                  {plan.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={plan.image}
                        alt={`${plan.name} at Woodley Village`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-emerald-500 text-white text-xs">
                          {plan.phase}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 text-right">
                        <p className="text-xs font-medium text-white/90 bg-black/50 px-2 py-1 rounded">
                          {plan.beds} Bed{plan.beds !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded mt-1">
                          {plan.sqft} sqft
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 relative flex items-center justify-center text-white">
                      <HomeIcon className="h-16 w-16 opacity-20 group-hover:scale-110 transition-transform" />
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-emerald-500 text-white text-xs">
                          {plan.phase}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 text-right">
                        <p className="text-xs font-medium text-white/80">
                          {plan.beds} Bed{plan.beds !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-white/60">
                          {plan.sqft} sqft
                        </p>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800">
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.desc}</CardDescription>
                  </CardHeader>
                  {/*<CardFooter>
                    <VerifyEmployeeButton
                      userId={userId}
                      redirectTo={`/projects/woodley-village/${plan.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      variant="outline"
                      className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      View Details
                    </VerifyEmployeeButton>
                  </CardFooter>*/}
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Neighborhood Section */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-4">
                Neighborhoods
              </h2>
              <Separator className="w-20 h-1 bg-emerald-500 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {neighborhoodSpots.map((spot) => (
                <Card
                  key={spot.name}
                  className="border-0 shadow-sm hover:shadow-md transition-all text-center p-6 bg-white"
                >
                  <spot.icon className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    {spot.name}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {spot.desc}
                  </CardDescription>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Lifestyle Footer Banner */}
        <section className="py-16 bg-slate-900 text-white">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {lifestyleFooter.map((item, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-bold tracking-wider">
                    {item.main}
                  </p>
                  <p className="text-sm text-white/70 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-emerald-800 relative overflow-hidden">
          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to find your dream home at Woodley Village?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join a community where neighbors become family. Register your
                interest today for priority access.
              </p>
              <VerifyEmployeeButton
                userId={userId}
                redirectTo="/projects/woodley-village/register"
                size="lg"
                className="bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-lg text-base px-8"
              >
                Register Now
              </VerifyEmployeeButton>
              <p className="text-xs text-white/70 mt-4">
                County-backed • Modern amenities • Sustainable living
              </p>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
