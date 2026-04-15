import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { signOutAction } from "./navigation/SignOut";

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/nrb-logo.png"
              alt="Nairobi County Housing"
              width={150}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
            >
              Contact
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
