import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import Link from 'next/link';
import { getFilteredNews } from '../lib/wordpress-graphql';
import NewsFilter from './NewsFilter';
import NewsPagination from './NewsPagination';

export const dynamic = 'force-dynamic';

interface AllNewsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AllNewsPage({ searchParams }: AllNewsPageProps) {
    const resolvedParams = await searchParams;

    // Parse params
    const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
    const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest';
    const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
    const limit = 12;

    // Fetch data using the filter helper
    const { posts, totalPosts, totalPages, currentPage } = await getFilteredNews({
        category,
        sort,
        page,
        limit
    });

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

                        {/* Filter Component */}
                        <NewsFilter totalPosts={totalPosts} />

                        {/* News Grid */}
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                {posts.map((article) => (
                                    <NewsCard key={article.id} article={article} variant="standard" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500 mb-4">Tidak ada berita yang ditemukan untuk kriteria ini.</p>
                                <Link href="/all-news" className="text-brand-600 hover:underline font-medium">
                                    Reset Filter &rarr;
                                </Link>
                            </div>
                        )}

                        {/* Pagination Component */}
                        <NewsPagination totalPages={totalPages} currentPage={currentPage} />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
