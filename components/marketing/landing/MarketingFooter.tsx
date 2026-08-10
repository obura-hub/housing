// components/marketing/MarketingFooter.tsx
import Link from "next/link";
import {
  Building2,
  ScanFace as Facebook,
  ThumbsDownIcon as Twitter,
  InspectIcon as Instagram,
  Mail,
  Phone,
} from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-white" />
              <span className="font-bold text-xl text-white">
                Nairobi Urban
              </span>
            </div>
            <p className="mt-2 text-sm">
              Transforming Nairobi through sustainable housing and urban
              renewal.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> housing@nairobi.go.ke
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +254 020 123456
              </li>
              <li className="flex items-start gap-2">
                City Hall, Nairobi, Kenya
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Newsletter</h3>
            <p className="text-sm">Subscribe for updates on new projects.</p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 text-sm rounded bg-gray-800 border border-gray-700 w-full"
              />
              <button className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} Nairobi City County Government. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
