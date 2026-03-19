import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to Nairobi County Housing Program
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
                Your Gateway to Affordable Home Ownership in Nairobi County
              </p>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"> 
                Start your journey towards home ownership. Fulfil your dreams by letting us 
                help you achieve your home ownership goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-[#16a34a] text-white rounded-lg hover:bg-[#166534] transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-8 py-4 bg-white text-[#16a34a] border-2 border-[#16a34a] rounded-lg hover:bg-green-50 transition-colors font-semibold text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose County Houses?
              </h2>
              <p className="text-lg text-gray-700/80 max-w-2xl mx-auto">
                We make affordable housing accessible to all Nairobi Employess through innovative programs and partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                <div className="w-12 h-12 bg-[#15B76C] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">County Affordable Housing</h3>
                <p className="text-gray-700">
                  Access quality housing at affordable prices designed to fit your budget and lifestyle.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                <div className="w-12 h-12 bg-[#15B76C] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Payment</h3>
                <p className="text-gray-700">
                  Save towards your home through convenient mobile payment options and flexible plans.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                <div className="w-12 h-12 bg-[#15B76C] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
                <p className="text-gray-700">
                  County-backed program ensuring security and transparency in all transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-700/80 max-w-2xl mx-auto">
                Simple steps to start your journey towards home ownership
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#15B76C] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Register</h3>
                  <p className="text-gray-700">
                    Create your account and complete your profile with basic information.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#15B76C] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Save</h3>
                  <p className="text-gray-700">
                    Start saving towards your home through our flexible payment plans.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#15B76C] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Own</h3>
                  <p className="text-gray-700">
                    Get allocated your affordable home and move in to start your new life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#15B76C] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Start Your Home Ownership Journey?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands who are already on their path to Nairobi County home ownership.
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-white text-[#15B76C] rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
              >
                Register Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
