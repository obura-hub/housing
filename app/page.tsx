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
} from "lucide-react";
import { Navbar } from "@/components/custom/Navbar";
import { VerifyEmployeeButton } from "@/components/custom/VerifyEmployeeButton";
import { Footer } from "@/components/custom/Footer";

export default async function Home() {
  const featuredProjects = await getFeaturedProjects(6);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Urban Renewal &{" "}
                <span className="text-primary">Affordable Housing</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your gateway to sustainable home ownership in Nairobi.
                County-backed, modern, and accessible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <VerifyEmployeeButton size="lg" className="text-lg px-8">
                  Get Started
                </VerifyEmployeeButton>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Explore Projects
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">5+</div>
                <p className="text-muted-foreground">Active Projects</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2,500+</div>
                <p className="text-muted-foreground">Homes Completed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <p className="text-muted-foreground">Registered Members</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">Ksh 4.5B</div>
                <p className="text-muted-foreground">Investment</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Projects - Carousel */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Featured Housing Projects
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our latest urban renewal developments designed for
                modern living.
              </p>
            </div>
            {featuredProjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No projects available yet.
              </div>
            ) : (
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredProjects.map((project) => (
                    <CarouselItem
                      key={project.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="h-full transition-all hover:shadow-lg">
                        <div className="relative h-48 w-full">
                          <Image
                            src={
                              project.coverImage || "/placeholder-project.jpg"
                            }
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {project.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-primary font-semibold">
                            <DollarSign className="h-4 w-4" /> {project.price}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link
                            href={`/projects/${project.id}`}
                            className="w-full"
                          >
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12" />
                <CarouselNext className="hidden md:flex -right-12" />
              </Carousel>
            )}
            <div className="text-center mt-12">
              <Link href="/projects">
                <Button variant="link">View All Projects →</Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From registration to moving into your dream home – we make it
                seamless.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Register",
                  desc: "Create your account and complete your profile.",
                },
                {
                  icon: Clock,
                  title: "Save",
                  desc: "Start saving through flexible payment plans.",
                },
                {
                  icon: HomeIcon,
                  title: "Own",
                  desc: "Get allocated a home and move in.",
                },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to Own Your Home?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of Nairobi residents who have found their dream
                home through our program.
              </p>
              <VerifyEmployeeButton
                size="lg"
                variant="secondary"
                className="text-primary"
              >
                Register Now
              </VerifyEmployeeButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
