'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const AUTH_KEY = 'bomayangu-auth';
const AUTH_EVENT = 'auth-changed';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(localStorage.getItem(AUTH_KEY) === 'true');
    };

    const onAuthChanged = () => syncAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) syncAuth();
    };

    window.addEventListener(AUTH_EVENT, onAuthChanged);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_EVENT, onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event(AUTH_EVENT));
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/nrb-logo.PNG"
              alt="My Home"
              width={150}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
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
              href="/#"
              className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
            >
              Quick Links

            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/register"
                className="px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
            <Link
              href="/"
              className="block text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              className="block text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/projects"
              className="block text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-[#15B76C] transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold text-center"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/register"
                className="block px-4 py-2 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
