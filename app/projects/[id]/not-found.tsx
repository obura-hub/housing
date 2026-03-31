import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          <Link
            href="/projects"
            className="inline-block px-6 py-3 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold"
          >
            View All Projects
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
