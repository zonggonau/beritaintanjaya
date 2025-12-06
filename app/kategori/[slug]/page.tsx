import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NewsCard from '../../components/NewsCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchPostsByCategory } from '../../lib/wordpress-graphql';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const categories = [
    {
        name: 'Pemerintahan',
        slug: 'pemerintahan',
        description: 'Informasi seputar kegiatan pemerintahan, kebijakan daerah, program kerja, dan pelayanan publik Kabupaten Intan Jaya.',
        color: 'brand'
    },
    {
        name: 'Pembangunan',
        slug: 'pembangunan',
        description: 'Update progres pembangunan infrastruktur, fasilitas publik, dan proyek pengembangan daerah.',
        color: 'green'
    },
    {
        name: 'Pendidikan',
        slug: 'pendidikan',
        description: 'Berita seputar dunia pendidikan, program pembelajaran, prestasi siswa, dan perkembangan sekolah.',
        color: 'purple'
    },
    {
        name: 'Kesehatan',
        slug: 'kesehatan',
        description: 'Informasi layanan kesehatan, program kesehatan masyarakat, dan upaya peningkatan kesejahteraan.',
        color: 'red'
    },
    {
        name: 'Sosial & Budaya',
        slug: 'sosial-budaya',
        description: 'Kegiatan sosial kemasyarakatan, pelestarian budaya lokal, dan tradisi masyarakat Papua.',
        color: 'orange'
    },
    {
        name: 'Ekonomi',
        slug: 'ekonomi',
        description: 'Perkembangan ekonomi daerah, pemberdayaan UMKM, dan peluang investasi di Intan Jaya.',
        color: 'teal'
    },
    {
        name: 'Keamanan',
        slug: 'keamanan',
        description: 'Informasi keamanan dan ketertiban masyarakat, koordinasi dengan aparat, dan kondisi sosial.',
        color: 'gray'
    },
];

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = categories.find((cat) => cat.slug === slug);

    if (!category) {
        notFound();
    }

    // Fetch posts from WordPress GraphQL by category
    const categoryNews = await fetchPostsByCategory(slug, 24);
    const relatedCategories = categories.filter((cat) => cat.slug !== slug).slice(0, 3);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Category Hero Header (Light Theme) */}
                <section className="bg-white border-b border-gray-200 py-12 md:py-16">
                    <div className="container-wide">
                        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                            <Link href="/" className="hover:text-brand-700 transition-colors">Beranda</Link>
                            <span>/</span>
                            <Link href="/all-news" className="hover:text-brand-700 transition-colors">Berita</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium font-bold">{category.name}</span>
                        </nav>

                        <div className="max-w-4xl">
                            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-widest rounded mb-4 border border-brand-100">
                                Kategori
                            </span>
                            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 leading-tight text-gray-900">
                                {category.name}
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-12 md:py-16">
                    <div className="container-wide">

                        {categoryNews.length > 0 ? (
                            <>
                                {/* Stats & Filter */}
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Menampilkan <span className="font-bold text-gray-900">{categoryNews.length}</span> artikel
                                    </div>
                                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                                        <option>Terbaru</option>
                                        <option>Terlama</option>
                                        <option>Terpopuler</option>
                                    </select>
                                </div>

                                {/* Featured Article (First one in horizontal layout) */}
                                {categoryNews.length > 0 && (
                                    <div className="mb-12">
                                        <NewsCard article={categoryNews[0]} variant="featured" />
                                    </div>
                                )}

                                {/* News Grid */}
                                {categoryNews.length > 1 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                        {categoryNews.slice(1).map((article) => (
                                            <NewsCard key={article.id} article={article} variant="standard" />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                                    Belum Ada Berita
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Belum ada berita yang dipublikasikan dalam kategori <strong>{category.name}</strong> saat ini.
                                </p>
                                <Link
                                    href="/all-news"
                                    className="inline-block px-6 py-3 bg-brand-700 text-white font-bold rounded-lg hover:bg-brand-800 transition-colors"
                                >
                                    Lihat Berita Lainnya
                                </Link>
                            </div>
                        )}

                        {/* Related Categories */}
                        {relatedCategories.length > 0 && (
                            <div className="mt-20 pt-12 border-t border-gray-200">
                                <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">
                                    Kategori Lainnya
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedCategories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/kategori/${cat.slug}`}
                                            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-lg transition-all"
                                        >
                                            <h4 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-700">
                                                {cat.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {cat.description}
                                            </p>
                                            <span className="inline-block mt-4 text-sm font-bold text-brand-700 group-hover:translate-x-1 transition-transform">
                                                Lihat Berita →
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
