import { ApartmentPlansSection } from "./ApartmentPlansSection";
import { ApartmentsComplexSection } from "./ApartmentsComplexSection";
import { CTASection } from "./CTASection";
import { FeaturedProjects } from "./FeaturedProjects";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { NeighborhoodSection } from "./NeighboorhoodSection";
import { TestimonialsSection } from "./TestimonialsSection";

export function SectionRenderer({ sections }: { sections: any[] }) {
  return sections.map((section, index) => {
    switch (section.__component) {
      case "sections.hero":
        return <HeroSection key={index} {...section} />;

      case "sections.features":
        return <FeaturesSection key={index} {...section} />;

      case "sections.plans":
        return <ApartmentPlansSection key={index} plans={section.plans} />;

      case "sections.apartments":
        return (
          <ApartmentsComplexSection
            key={index}
            apartments={section.apartments}
          />
        );

      case "sections.neighborhood":
        return <NeighborhoodSection key={index} places={section.places} />;

      case "sections.projects":
        return <FeaturedProjects key={index} projects={section.projects} />;

      case "sections.testimonials":
        return <TestimonialsSection key={index} />;

      case "sections.cta":
        return <CTASection key={index} />;

      default:
        return null;
    }
  });
}
