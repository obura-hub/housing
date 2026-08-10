// app/(marketing)/layout.tsx (revised)

import { MarketingFooter } from "@/components/marketing/landing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/landing/MarketingNavbar";
import { getAllProjects } from "@/lib/actions/projectActions";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getAllProjects();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingNavbar projects={projects} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}

// import { MarketingFooter } from "@/components/marketing/landing/MarketingFooter";
// import { MarketingNavbar } from "@/components/marketing/landing/MarketingNavbar";
// import { getAllProjects } from "@/lib/strapi/projects";

// export default async function MarketingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const projects = await getAllProjects();

//   // normalize data
//   const formattedProjects = projects.map((p: any) => ({
//     id: p.id,
//     name: p.name,
//     slug: p.slug,
//   }));

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <MarketingNavbar projects={formattedProjects} />
//       <main className="flex-1">{children}</main>
//       <MarketingFooter />
//     </div>
//   );
// }
