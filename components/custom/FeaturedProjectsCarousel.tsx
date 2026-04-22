"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { VerifyEmployeeButton } from "@/components/custom/VerifyEmployeeButton";
import { MapPin, DollarSign, ArrowRight } from "lucide-react";

export function FeaturedProjectsCarousel({ projects, userId }) {
  if (!projects.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No projects available yet.
      </div>
    );
  }

  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {projects.map((project) => (
          <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full overflow-hidden">
              <div className="relative h-52 w-full">
                <Image
                  src={project.coverImage || "/placeholder-project.jpg"}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 font-bold">
                    <DollarSign className="h-4 w-4" />
                    {project.price}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/projects/${project.id}`} className="w-full">
                  <VerifyEmployeeButton
                    userId={userId}
                    redirectTo={`/projects/${project.id}`}
                    className="w-full"
                  >
                    View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </VerifyEmployeeButton>
                </Link>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
