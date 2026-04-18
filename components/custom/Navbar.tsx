import Link from "next/link";
import { Container } from "../ui/container";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="font-bold text-xl text-foreground">
              Nairobi Urban Renewal
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium hover:text-primary transition"
            >
              Projects
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium hover:text-primary transition"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
