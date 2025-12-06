import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import Link from 'next/link';
import { fetchPosts } from '../lib/wordpress-graphql';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function AllNewsPage() {
    // Fetch posts from WordPress
    const { posts: newsData } = await fetchPosts(24);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Page Header */}
                <section className="bg-gray-50 py-12 border-b border-gray-100">
                    <div className="container-wide">
                        <nav className="text-sm text-gray-500 mb-6">
                            <Link href="/" className="hover:text-brand-700">Beranda</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 font-medium">Arsip Berita</span>
                        </nav>
                        <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-3">
                            Arsip Berita
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl">
                            Jelajahi koleksi lengkap berita dan informasi dari Pemerintah Kabupaten Intan Jaya.
                        </p>
                    </div>
                </section>

                {/* Filter & Content */}
                <section className="py-12">
                    <div className="container-wide">

                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-bold text-gray-900">{newsData.length}</span> artikel ditemukan
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <label htmlFor="category-filter" className="text-sm font-medium text-gray-600">
                                    Kategori:
                                </label>
                                <select
                                    id="category-filter"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="pemerintahan">Pemerintahan</option>
                                    <option value="pembangunan">Pembangunan</option>
                                    <option value="pendidikan">Pendidikan</option>
                                    <option value="kesehatan">Kesehatan</option>
                                    <option value="ekonomi">Ekonomi</option>
                                </select>

                                <label htmlFor="sort-filter" className="text-sm font-medium text-gray-600 ml-2">
                                    Urutkan:
                                </label>
                                <select
                                    id="sort-filter"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="oldest">Terlama</option>
                                    <option value="popular">Terpopuler</option>
                                </select>
                            </div>
                        </div>

                        {/* News Grid */}
                        {newsData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                {newsData.map((article) => (
                                    <NewsCard key={article.id} article={article} variant="standard" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500 mb-4">Tidak ada berita yang ditemukan.</p>
                                <Link href="/" className="text-brand-600 hover:underline font-medium">
                                    Kembali ke Beranda &rarr;
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-16 flex justify-center">
                            <nav className="flex items-center gap-2" aria-label="Pagination">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled
                                >
                                    ← Sebelumnya
                                </button>

                                <button className="px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-bold">
                                    1
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    2
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    3
                                </button>
                                <span className="px-2 text-gray-400">...</span>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    10
                                </button>

                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    Berikutnya →
                                </button>
                            </nav>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
