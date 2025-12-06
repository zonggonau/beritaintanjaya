import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import NewsCard from '../../components/NewsCard';
import ShareButtons from '../../components/ShareButtons';
import { fetchPostBySlug, fetchLatestPosts, fetchPostsByCategory } from '../../lib/wordpress-graphql';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface NewsDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(
    { params }: NewsDetailPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchPostBySlug(slug);

    if (!article) {
        return {
            title: 'Berita Tidak Ditemukan',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${article.title} - Berita Intan Jaya`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `https://intanjayakab.go.id/berita/${slug}`,
            siteName: 'Berita Intan Jaya',
            images: [
                {
                    url: article.image || '',
                    width: 1200,
                    height: 630,
                },
                ...previousImages,
            ],
            locale: 'id_ID',
            type: 'article',
            publishedTime: article.date,
            authors: [article.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [article.image || ''],
        },
    };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { slug } = await params;

    // Fetch Data Parallel
    const articleData = fetchPostBySlug(slug);
    const latestData = fetchLatestPosts(5); // For Sidebar

    const [article, latestNews] = await Promise.all([articleData, latestData]);

    if (!article) {
        notFound();
    }

    // Fetch Related (by category) - must be done after article is loaded to get category slug
    const relatedNews = await fetchPostsByCategory(article.categorySlug, 3);
    // Filter out current article from related
    const filteredRelated = relatedNews.filter(item => item.id !== article.id).slice(0, 3);

    const shareUrl = `https://intanjayakab.go.id/berita/${slug}`;

    return (
        <div className="min-h-screen bg-white flex flex-col font-body">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb Section */}
                <div className="bg-gray-50 border-b border-gray-100 py-4">
                    <div className="container-wide">
                        <nav className="text-sm text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                            <Link href="/" className="hover:text-brand-700">Beranda</Link>
                            <span>/</span>
                            <Link href={`/kategori/${article.categorySlug}`} className="hover:text-brand-700">{article.category}</Link>
                            <span>/</span>
                            <span className="text-gray-900 line-clamp-1 font-medium">{article.title}</span>
                        </nav>
                    </div>
                </div>

                <div className="container-wide py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* MAIN ARTICLE CONTENT (Left 8 Cols) */}
                        <article className="lg:col-span-8">

                            {/* Header */}
                            <header className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold uppercase rounded tracking-wide">
                                        {article.category}
                                    </span>
                                    <span className="text-gray-500 text-sm font-medium">
                                        {article.date}
                                    </span>
                                </div>
                                <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900 leading-tight mb-6">
                                    {article.title}
                                </h1>
                                <div className="flex items-center gap-3 border-y border-gray-100 py-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-500">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{article.author}</p>
                                        <p className="text-xs text-gray-500">Editor Berita Intan Jaya</p>
                                    </div>
                                    <div className="ml-auto">
                                        <ShareButtons url={shareUrl} title={article.title} />
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm mb-10">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Body Content */}
                            <div
                                className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed font-body mb-12"
                                dangerouslySetInnerHTML={{ __html: article.content || '' }}
                            />

                            {/* Bottom Share */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-12">
                                <h4 className="font-bold text-gray-900 mb-4 text-center">Bagikan Artikel Ini</h4>
                                <div className="flex justify-center">
                                    <ShareButtons url={shareUrl} title={article.title} />
                                </div>
                            </div>

                            {/* Related News Section */}
                            {filteredRelated.length > 0 && (
                                <section className="border-t border-gray-200 pt-10">
                                    <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">
                                        Berita Terkait
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredRelated.map((item) => (
                                            <NewsCard key={item.id} article={item} variant="standard" />
                                        ))}
                                    </div>
                                </section>
                            )}

                        </article>


                        {/* SIDEBAR (Right 4 Cols) */}
                        <aside className="lg:col-span-4 space-y-10">

                            {/* Search Widget (Placeholder) */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4 font-display">Cari Berita</h4>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Kata kunci..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Popular/Latest Widget */}
                            <div>
                                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
                                    <h3 className="font-display font-bold text-xl text-gray-900 flex-1">
                                        Berita Terbaru
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {latestNews.map((item, index) => (
                                        <div key={item.id} className="group flex gap-4 items-start">
                                            <span className="text-3xl font-display font-bold text-gray-200 group-hover:text-brand-100 transition-colors select-none -mt-2">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1">
                                                <Link href={`/berita/${item.slug || item.id}`} className="block">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug mb-1">
                                                        {item.title}
                                                    </h4>
                                                </Link>
                                                <span className="text-xs text-gray-500">{item.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Categories Widget */}
                            <div>
                                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
                                    <h3 className="font-display font-bold text-xl text-gray-900 flex-1">
                                        Kategori
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Pemerintahan', 'Pembangunan', 'Ekonomi', 'Kesehatan', 'Pendidikan'].map((cat) => (
                                        <Link
                                            key={cat}
                                            href={`/kategori/${cat.toLowerCase()}`}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-brand-600 hover:text-white transition-colors"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        </aside>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
