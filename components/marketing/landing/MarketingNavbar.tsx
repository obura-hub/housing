// components/marketing/MarketingNavbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
}

// This would normally come from an API or context, but we'll fetch dynamically
// For simplicity, we'll use a client-side fetch, but in production you'd SSR the projects list
const fetchProjects = async () => {
  const res = await fetch("/api/projects"); // you'd need an API endpoint
  return res.json();
};

export function MarketingNavbar({ projects }: { projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/portal" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">
              Nairobi Urban
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/portal"
              className="text-sm font-medium hover:text-primary transition"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition">
                Projects <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/portal/woodley">Woodley</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/jeevanjee">Jeevanjee</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/pangani">Pangani</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <div className="flex flex-col pl-4 space-y-2">
                <span className="text-xs text-muted-foreground">Projects</span>
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="text-sm hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {project.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="w-full mt-2">
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// // components/marketing/MarketingNavbar.tsx
// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Menu, X, ChevronDown, Building2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";

// interface Project {
//   id: number;
//   name: string;
// }

// export function MarketingNavbar({ projects }: { projects: Project[] }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={cn(
//         "fixed top-0 w-full z-50 transition-all duration-300",
//         scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent",
//       )}
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <Building2 className="h-6 w-6 text-primary" />
//             <span className="font-bold text-xl tracking-tight">
//               Nairobi Urban
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link
//               href="/"
//               className="text-sm font-medium hover:text-primary transition"
//             >
//               Home
//             </Link>
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition">
//                 Projects <ChevronDown className="h-4 w-4" />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="center" className="w-48">
//                 {projects.map((project) => (
//                   <DropdownMenuItem key={project.id} asChild>
//                     <Link href={`/projects/${project.slug}`}>
//                       {project.name}
//                     </Link>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             <Link
//               href="/contact"
//               className="text-sm font-medium hover:text-primary transition"
//             >
//               Contact
//             </Link>
//           </nav>

//           {/* CTA Button */}
//           <div className="hidden md:block">
//             <Button asChild>
//               <Link href="/register">Get Started</Link>
//             </Button>
//           </div>

//           {/* Mobile menu button */}
//           <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {isOpen && (
//           <div className="md:hidden py-4 border-t border-gray-100">
//             <div className="flex flex-col space-y-3">
//               <Link
//                 href="/"
//                 className="text-sm font-medium hover:text-primary"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Home
//               </Link>
//               <div className="flex flex-col pl-4 space-y-2">
//                 <span className="text-xs text-muted-foreground">Projects</span>
//                 {projects.map((project) => (
//                   <Link
//                     key={project.id}
//                     href={`/projects/${project.id}`}
//                     className="text-sm hover:text-primary"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {project.name}
//                   </Link>
//                 ))}
//               </div>
//               <Link
//                 href="/contact"
//                 className="text-sm font-medium hover:text-primary"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Contact
//               </Link>
//               <Button asChild className="w-full mt-2">
//                 <Link href="/register" onClick={() => setIsOpen(false)}>
//                   Get Started
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
