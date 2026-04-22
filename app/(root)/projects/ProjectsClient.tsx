// app/projects/ProjectsClient.tsx (Client Component)
"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Search,
  SlidersHorizontal,
  MapPin,
  Home,
  TrendingUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  location: string;
  price: string;
  description: string;
  status: string;
  coverImage: string | null;
  totalUnits: number;
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Extract unique locations
  const locations = useMemo(() => {
    const locs = new Set(initialProjects.map((p) => p.location));
    return Array.from(locs).sort();
  }, [initialProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...initialProjects];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((p) => selectedLocations.includes(p.location));
    }

    filtered = filtered.filter((p) => {
      const price = p?.price ? parseInt(p.price.replace(/[^0-9]/g, "")) : 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => {
          const aPrice = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
          const bPrice = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
          return aPrice - bPrice;
        });
        break;
      case "price_desc":
        filtered.sort((a, b) => {
          const aPrice = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
          const bPrice = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
          return bPrice - aPrice;
        });
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    return filtered;
  }, [
    initialProjects,
    searchQuery,
    statusFilter,
    selectedLocations,
    priceRange,
    sortBy,
  ]);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedLocations([]);
    setPriceRange([0, 20000000]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "all" ||
    selectedLocations.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 20000000;

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Status
        </h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-muted">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Location
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {locations.map((loc) => (
            <label
              key={loc}
              className="flex items-center gap-2 text-sm cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedLocations.includes(loc)}
                onChange={() => toggleLocation(loc)}
                className="rounded border-muted-foreground/30 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="group-hover:text-primary transition-colors">
                {loc}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" /> Price Range (Ksh)
        </h3>
        <Slider
          min={0}
          max={20000000}
          step={500000}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Ksh {priceRange[0].toLocaleString()}</span>
          <span>Ksh {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4 mr-2" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 bg-muted/20 rounded-xl p-5 h-fit sticky top-24">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </h2>
        <FilterContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 border-muted focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[170px] h-11 border-muted">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden gap-2 h-11 border-muted"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                <SheetHeader className="text-left">
                  <SheetTitle>Filter Projects</SheetTitle>
                  <SheetDescription>
                    Narrow down by status, location, or price range.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 overflow-y-auto h-full">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 pl-2 pr-1 py-1 capitalize"
              >
                Status: {statusFilter}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                  onClick={() => setStatusFilter("all")}
                />
              </Badge>
            )}
            {selectedLocations.map((loc) => (
              <Badge
                key={loc}
                variant="secondary"
                className="gap-1 pl-2 pr-1 py-1"
              >
                {loc}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                  onClick={() => toggleLocation(loc)}
                />
              </Badge>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 20000000) && (
              <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                Ksh {priceRange[0].toLocaleString()} -{" "}
                {priceRange[1].toLocaleString()}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                  onClick={() => setPriceRange([0, 20000000])}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredProjects.length}
            </span>{" "}
            of {initialProjects.length} projects
          </p>
        </div>

        {/* Projects Grid with Animation */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              No projects match your filters.
            </p>
            <Button
              variant="link"
              onClick={clearFilters}
              className="mt-2 text-primary"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  "animate-in fade-in slide-in-from-bottom-4 duration-500",
                  isMounted && `delay-${Math.min((index % 5) + 1) * 100}`,
                )}
                style={{ animationFillMode: "backwards" }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
