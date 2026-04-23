// components/custom/Footer.tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  // Facebook,
  // Twitter,
  // Linkedin,
} from "lucide-react";
import Logo from "./logo";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-muted/10">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-16 w-16 rounded-full  flex items-center justify-center">
                <Logo />
              </div>
              <h3 className="font-bold text-lg text-primary">
                Nairobi City County
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transforming Nairobi through sustainable housing, urban renewal,
              and digital innovation for a better tomorrow.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/*<Facebook className="h-4 w-4" />*/}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/*<Twitter className="h-4 w-4" />*/}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/*<Linkedin className="h-4 w-4" />*/}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/projects"
                  className="hover:text-primary transition-colors"
                >
                  Housing Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact Info</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>City Hall, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>housing@nairobi.go.ke</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>+254 020 123456</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Subscribe for project updates and affordable housing news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>

        <div className="border-t border-border py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()} Nairobi City County Government. All
            rights reserved.
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-secondary"></span>
            Powered by Innovation & Digital Economy
          </span>
        </div>
      </Container>
    </footer>
  );
}
