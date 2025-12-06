import Header from './components/Header';
import Footer from './components/Footer';
import NewsCard from './components/NewsCard';
import Link from 'next/link';
import { fetchFeaturedPosts, fetchLatestPosts, fetchPostsByCategory } from './lib/wordpress-graphql';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Berita Intan Jaya - Portal Resmi Pemerintah Kabupaten Intan Jaya',
  description: 'Portal berita resmi Pemerintah Kabupaten Intan Jaya, Papua Tengah. Menyajikan informasi terkini seputar pemerintahan, pembangunan, dan kegiatan kemasyarakatan.',
  openGraph: {
    title: 'Berita Intan Jaya - Portal Resmi Pemerintah',
    description: 'Sumber informasi terpercaya pembangunan dan pemerintahan Kabupaten Intan Jaya, Papua Tengah.',
    siteName: 'Berita Intan Jaya',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berita Intan Jaya',
    description: 'Portal Berita Resmi Pemkab Intan Jaya',
  },
};

export default async function HomePage() {
  // Fetch data from WordPress GraphQL
  const featured = await fetchFeaturedPosts(3);
  const mainStory = featured[0];
  const sideStories = await fetchLatestPosts(4);
  const latestNews = await fetchLatestPosts(12);
  const governmentNews = await fetchPostsByCategory('pemerintahan', 3);

  return (
    <div className="min-h-screen bg-white flex flex-col font-body text-gray-800">
      <Header />

      <main className="flex-1">

        {/* SECTION 1: HEADLINES (Top Story + Sidebar) */}
        <section className="pt-8 pb-12 border-b border-gray-100">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Left Column: Main Hero Story */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Headline Utama</span>
                </div>
                {mainStory && <NewsCard article={mainStory} variant="hero" />}
              </div>

              {/* Right Column: Trending / Sidebar List */}
              <div className="lg:col-span-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
                  <h3 className="font-display font-bold text-xl text-gray-900 flex-1">
                    Topik Terhangat
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {sideStories.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative">
                      <NewsCard article={item} variant="minimal" />
                    </div>
                  ))}
                </div>

                {/* Promo/Ads Placeholder */}
                <div className="mt-6 bg-brand-50 rounded-lg p-6 text-center border border-brand-100">
                  <h4 className="font-bold text-brand-800 mb-2">Layanan Publik Online</h4>
                  <p className="text-sm text-brand-600 mb-4">Akses layanan administrasi kependudukan dengan mudah.</p>
                  <a
                    href="https://intanjayakab.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded hover:bg-brand-700 transition"
                  >
                    Akses Sekarang
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: LATEST NEWS (Grid 4 Columns) */}
        <section className="py-16">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-brand-600 font-bold uppercase tracking-widest text-xs mb-1 block">Update Terkini</span>
                <h2 className="font-display font-bold text-3xl text-gray-900">Berita Terbaru</h2>
              </div>
              <Link href="/all-news" className="text-sm font-bold text-gray-500 hover:text-brand-700 border-b border-transparent hover:border-brand-700 transition-all">
                LIHAT SEMUA &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
              {latestNews.slice(0, 8).map((item) => (
                <NewsCard key={item.id} article={item} variant="standard" />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FOCUS CATEGORY (Government) */}
        {governmentNews.length > 0 && (
          <section className="py-16 bg-gray-50 border-y border-gray-100">
            <div className="container-wide">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-3">
                  <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">Fokus: Pemerintahan</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Ikuti perkembangan kebijakan, program kerja, dan kegiatan resmi Pemerintah Daerah Kabupaten Intan Jaya.
                  </p>
                  <Link
                    href="/kategori/pemerintahan"
                    className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 font-bold text-sm tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    INDEKS PEMERINTAHAN
                  </Link>
                </div>
                <div className="lg:col-span-9">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {governmentNews.map((item) => (
                      <NewsCard key={item.id} article={item} variant="standard" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
