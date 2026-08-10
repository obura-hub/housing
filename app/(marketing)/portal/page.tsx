// app/(marketing)/page.tsx
import { ApartmentPlansSection } from "@/components/marketing/landing/ApartmentPlansSection";
import { ApartmentsComplexSection } from "@/components/marketing/landing/ApartmentsComplexSection";
import { CTASection } from "@/components/marketing/landing/CTASection";
import { FeaturedProjects } from "@/components/marketing/landing/FeaturedProjects";
import { FeaturesSection } from "@/components/marketing/landing/FeaturesSection";
import { HeroSection } from "@/components/marketing/landing/HeroSection";
import { NeighborhoodSection } from "@/components/marketing/landing/NeighboorhoodSection";
import { TestimonialsSection } from "@/components/marketing/landing/TestimonialsSection";
import { getFeaturedProjects } from "@/lib/actions/projectActions";

export default async function LandingPage() {
  const featuredProjects = await getFeaturedProjects(5); // get 3 featured projects
  const plans = [
    {
      id: "studio",
      title: "Studio Apartment",
      blockImage: "/images/plans/plan1.jpg",
      unitImage: "/images/plans/plan1.jpg",
    },
    {
      id: "one-bedroom-phase-1",
      title: "One Bedroom – Phase 1",
      blockImage: "/images/plans/plan2.jpg",
      unitImage: "/images/plans/plan2.jpg",
    },
    {
      id: "one-bedroom-phase-2",
      title: "One Bedroom – Phase 2",
      blockImage: "/images/plans/plan3.jpg",
      unitImage: "/images/plans/plan3.jpg",
    },
  ];

  const places = [
    {
      id: "1",
      name: "Greenwood High School",
      category: "Schools",
      distance: "5 min drive",
      image: "/neighborhood/school.jpg",
    },
    {
      id: "2",
      name: "City Care Hospital",
      category: "Hospitals",
      distance: "8 min drive",
      image: "/neighborhood/hospital.jpg",
    },
    {
      id: "3",
      name: "Central Park",
      category: "Parks",
      distance: "10 min walk",
      image: "/neighborhood/park.jpg",
    },
  ];

  const apartments = [
    {
      id: "studio",
      title: "Studio Apartments",
      type: "Studio",
      image: "/apartments/studio.jpg",
      units: 120,
      size: "35 sqm",
    },
    {
      id: "one-bedroom",
      title: "One Bedroom Units",
      type: "1 Bedroom",
      image: "/apartments/onebed.jpg",
      units: 200,
      size: "55 sqm",
    },
    {
      id: "two-bedroom",
      title: "Two Bedroom Units",
      type: "2 Bedroom",
      image: "/apartments/twobed.jpg",
      units: 150,
      size: "75 sqm",
    },
  ];

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <FeaturesSection />
      <ApartmentPlansSection plans={plans} />
      <ApartmentsComplexSection apartments={apartments} />
      <NeighborhoodSection places={places} />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

// import { SectionRenderer } from "@/components/marketing/landing/SectionRenderer";
// import { getLandingPage } from "@/lib/strapi/landing";

// export default async function LandingPage() {
//   const page = await getLandingPage();

//   if (!page) return null;

//   const sections = page.sections;

//   return <SectionRenderer sections={sections} />;
// }
