import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Image
              src="/assets/nrb-logo.png"
              alt="Boma Yangu"
              width={150}
              height={60}
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm text-gray-400">
              The County Housing platform is the gateway into the Affordable
              Housing Program. Start your journey towards home ownership.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/downloads"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  Downloads
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  News & Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:enquiries@bomayangu.go.ke"
                  className="hover:text-[#16a34a] transition-colors"
                >
                  enquiries@urbanplanning.go.ke
                </a>
              </li>
              <li className="text-gray-400">Urban Planning & Development</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Powered by: SMART Nairobi - All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
