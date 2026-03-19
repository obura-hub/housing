import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                About County Housing Project
              </h1>
              <p className="text-xl text-gray-700">
                County Employees to achieve their dream of home ownership
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div className="space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Thhjhmk,kj.kjkjhgfhjdfrhg
                  jhgrjbfikogs saouhaefio
                  jhegfuitgye,
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg leading-relaxed">
                  kjhdgv nm,xvuhgswmn,aklefhkelweslbgv
                  dgvoiuhylnghbb
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                  Our Vision
                </h2>
                <p className="text-lg leading-relaxed">
                  ghjlfbm afuesw, sdegv dv
                  fhdm, sigwt,szd;lsa
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                  Key Features
                </h2>
                <ul className="list-disc list-inside space-y-3 text-lg">
                  <li>Easy registration and account management</li>
                  <li>Flexible savings plans tailored to your needs</li>
                  <li>Transparent allocation process</li>
                  <li>Secure payment options via mobile money</li>
                  <li>Access to quality housing projects across Kenya</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
