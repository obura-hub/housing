'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const AUTH_KEY = 'bomayangu-auth';
const AUTH_EVENT = 'auth-changed';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem(AUTH_KEY, 'true');
    window.dispatchEvent(new Event(AUTH_EVENT));
    router.push('/projects');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Login to Your Account
              </h1>
              <p className="text-gray-700 text-center mb-8">
                Access your Boma Yangu account to manage your savings
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-900 mb-2">
                    National ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#15B76C] focus:border-transparent"
                    placeholder="Enter your ID number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#15B76C] focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-[#15B76C] focus:ring-[#15B76C] border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                <Link href="/forgot-password" className="text-sm text-[#16a34a] hover:text-[#166534]">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#166534] transition-colors font-semibold"
                >
                  Login
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-[#16a34a] font-semibold hover:text-[#166534]">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
