import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Nairobi Urban Renewal</h3>
            <p className="text-sm text-muted-foreground">
              Transforming Nairobi through sustainable housing and urban
              development.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/projects" className="hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>City Hall, Nairobi</li>
              <li>Email: housing@nairobi.go.ke</li>
              <li>Phone: +254 020 123456</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4">
              {/* Add social icons if desired */}
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nairobi City County Government. All
          rights reserved.
        </div>
      </Container>
    </footer>
  );
}
