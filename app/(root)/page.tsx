// app/(root)/page.tsx (Home page)
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Container } from "@/components/ui/container";

import { getFeaturedProjects } from "@/lib/actions/projectActions";
import {
  MapPin,
  DollarSign,
  Home as HomeIcon,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Award,
  ArrowRight,
} from "lucide-react";
import { VerifyEmployeeButton } from "@/components/custom/VerifyEmployeeButton";
import { AutoVerifyModal } from "@/components/custom/AutoVerifyModal";
import { auth } from "@/auth";
import { FeaturedProjectsCarousel } from "@/components/custom/FeaturedProjectsCarousel";

export default async function Home() {
  const session = await auth();

  const userId = session?.user?.id;

  const featuredProjects = await getFeaturedProjects(6);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with County Colors & Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary/20 py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <Container>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              {/* County badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/30">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-white">
                  Nairobi City County | Innovation & Digital Economy
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                Urban Renewal &{" "}
                <span className="text-secondary drop-shadow-sm">Housing</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Your gateway to sustainable home ownership in Nairobi.
                County-backed, modern, and accessible for all county employees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <VerifyEmployeeButton
                  userId={userId}
                  redirectTo="/dashboard"
                  size="lg"
                  className="bg-secondary text-primary hover:bg-secondary/90 shadow-lg text-base px-8"
                >
                  Get Started
                </VerifyEmployeeButton>

                <VerifyEmployeeButton
                  userId={userId}
                  redirectTo="/projects"
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:text-white text-base px-8"
                >
                  Explore Projects
                </VerifyEmployeeButton>
              </div>
            </div>
          </Container>
          {/* Wave SVG bottom */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-full h-8 md:h-12"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="white"
              ></path>
            </svg>
          </div>
        </section>

        {/* Stats Section with Light Yellow Accents */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="text-3xl font-bold text-primary">5+</div>
                <p className="text-muted-foreground text-sm">Active Projects</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="text-3xl font-bold text-primary">2,500+</div>
                <p className="text-muted-foreground text-sm">Homes Completed</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <p className="text-muted-foreground text-sm">
                  Registered Members
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="text-3xl font-bold text-primary">Ksh 4.5B</div>
                <p className="text-muted-foreground text-sm">
                  Total Investment
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-gradient-to-b from-white to-muted/20">
          <Container>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1 mb-4">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Featured
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Premier Housing Projects
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our latest urban renewal developments designed for
                modern living with sustainable infrastructure.
              </p>
            </div>

            {featuredProjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No projects available yet.
              </div>
            ) : (
              <FeaturedProjectsCarousel
                projects={featuredProjects}
                userId={userId}
              />
            )}

            <div className="text-center mt-12">
              <VerifyEmployeeButton
                userId={userId}
                redirectTo="/projects"
                variant="link"
                className="text-primary gap-1"
              >
                View All Projects <ArrowRight className="h-4 w-4" />
              </VerifyEmployeeButton>
            </div>
          </Container>
        </section>

        {/* How It Works - Enhanced with County Colors */}
        <section className="py-20 bg-primary/5">
          <Container>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/30 rounded-full px-3 py-1 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Simple Process
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Your Journey to{" "}
                <span className="text-primary">Home Ownership</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From registration to moving into your dream home – we make it
                seamless, transparent, and county-supported.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Register & Verify",
                  desc: "Create your account and complete your profile with secure employee verification.",
                  step: "01",
                },
                {
                  icon: Clock,
                  title: "Save & Plan",
                  desc: "Start saving through flexible payment plans tailored to your income.",
                  step: "02",
                },
                {
                  icon: HomeIcon,
                  title: "Own & Move In",
                  desc: "Get allocated a home, complete the process, and move into your new home.",
                  step: "03",
                },
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -top-3 -left-3 text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </div>
                  <div className="relative z-10 text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border/50">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-6 w-6 text-primary/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section with Dark Green Background & Light Yellow Accent */}
        <section className="py-20 bg-gradient-county relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-5"></div>
          <Container>
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                Ready to Own Your Dream Home?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join thousands of Nairobi County staffs who have found their
                dream home through our county-backed affordable housing program.
              </p>
              <VerifyEmployeeButton
                userId={userId}
                redirectTo="/dashboard"
                size="lg"
                variant="secondary"
                className="bg-secondary text-primary hover:bg-secondary/90 shadow-lg px-8 py-6 text-lg"
              >
                Register Now
              </VerifyEmployeeButton>
              <p className="text-xs text-white/70 mt-4">
                No hidden fees • Transparent process • County guaranteed
              </p>
            </div>
          </Container>
        </section>
      </main>
      <AutoVerifyModal />
    </div>
  );
}
