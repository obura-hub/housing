// components/custom/Navbar.tsx
"use client";
import Link from "next/link";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { Building2, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./logo";
import Image from "next/image";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-muted shadow-sm">
      <Container>
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-md">
              <Logo />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary tracking-tight">
                Nairobi City County
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                Urban Renewal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Projects
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Contact
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-secondary/20"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90 shadow-sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-2 bg-white">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-2 py-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="px-2 py-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/how-it-works"
                className="px-2 py-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/contact"
                className="px-2 py-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-border pt-3 mt-1 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-primary text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
