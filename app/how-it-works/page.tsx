import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                How It Works
              </h1>
              <p className="text-xl text-gray-700">
                Simple steps to start your journey towards home ownership
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#15B76C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Register Your Account</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      gkdglhrhygklh
                      defhgteortekwltweos
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#15B76C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Saving</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Begin saving towards your home through our flexible payment plans. You can 
                      save any amount at any time using ...........
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#15B76C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Available Projects</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Explore the various affordable housing projects available across different 
                      locations in Nairobi County. Each project includes detailed information about pricing, 
                      location, and amenities.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#15B76C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Allocated</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Once you meet the requirements and have saved the required amount, you'll 
                      be eligible for allocation. The allocation process is transparent and fair, 
                      ensuring equal opportunity for all members.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#15B76C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Move In</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Complete the final payment and documentation process, then move into your 
                      new home! 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Info Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Payment Information
              </h2>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Paybill Number:</h3>
                    <p className="text-2xl font-bold text-[#15B76C]">000000000</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Account Number:</h3>
                    <p className="text-xl text-gray-700">Your ID Number</p>
                    <p className="text-sm text-gray-500 mt-1">Example: nnmmmm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
