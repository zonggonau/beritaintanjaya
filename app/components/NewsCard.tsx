import Link from 'next/link';

export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    categorySlug: string;
    image: string;
    date: string;
    author: string;
    slug?: string;
    readTime?: string;
}

interface NewsCardProps {
    article: NewsArticle;
    variant?: 'hero' | 'featured' | 'standard' | 'minimal' | 'overlay';
}

const catColors: any = {
    pemerintahan: 'bg-blue-100 text-blue-800',
    pembangunan: 'bg-green-100 text-green-800',
    pendidikan: 'bg-purple-100 text-purple-800',
    kesehatan: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
};

export default function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
    const badgeColor = catColors[article.categorySlug] || catColors.default;
    const href = `/berita/${article.slug || article.id}`;

    // VARIANT: HERO (Big Image Background)
    if (variant === 'hero') {
        return (
            <Link href={href} className="block group relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-black">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                />
                {/* Gradient Overlay yang lebih pekat untuk menjamin keterbacaan teks */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90"></div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col justify-end h-full z-10 pointer-events-none">
                    <span className="inline-block px-3 py-1 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded mb-4 w-fit shadow-md border border-white/20">
                        {article.category}
                    </span>
                    <h2 className="text-2xl md:text-5xl font-display font-bold !text-white mb-4 leading-tight drop-shadow-xl">
                        {article.title}
                    </h2>
                    <p className="text-white md:text-lg line-clamp-2 md:line-clamp-3 mb-4 max-w-2xl drop-shadow-lg font-medium opacity-95">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center text-white text-xs md:text-sm font-bold drop-shadow-md">
                        <span>{article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{article.date}</span>
                    </div>
                </div>
            </Link>
        );
    }

    // VARIANT: OVERLAY (Mosaic Grid Style)
    if (variant === 'overlay') {
        return (
            <Link href={href} className="block group relative w-full h-full min-h-[240px] overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>

                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end z-10">
                    <span className="inline-block text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-2">
                        {article.category}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md group-hover:text-brand-100 transition-colors line-clamp-3">
                        {article.title}
                    </h3>
                    <span className="text-[10px] text-gray-300 mt-2 font-medium">{article.date}</span>
                </div>
            </Link>
        );
    }

    // VARIANT: FEATURED (Horizontal Flex)
    if (variant === 'featured') {
        return (
            <Link href={href} className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-8 border-b border-gray-100 pb-8 last:border-0 items-start">
                <div className="md:col-span-4 h-48 md:h-40 overflow-hidden rounded-lg bg-gray-100">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="md:col-span-8 flex flex-col h-full bg-white content-center justify-center">
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium">
                        <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wide text-[10px] ${badgeColor}`}>
                            {article.category}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{article.date}</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-3 leading-tight group-hover:text-brand-700 transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                        {article.excerpt}
                    </p>
                </div>
            </Link>
        );
    }

    // VARIANT: MINIMAL (Sidebar with Thumbnail)
    if (variant === 'minimal') {
        return (
            <Link href={href} className="group flex gap-4 mb-5 pb-5 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0 items-start">
                <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-medium">
                        <span className="text-brand-600 font-bold uppercase tracking-wide text-[10px]">{article.category}</span>
                    </div>
                    <h4 className="text-sm font-bold font-display text-gray-900 leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
                        {article.title}
                    </h4>
                    <span className="text-xs text-gray-400 mt-1">{article.date}</span>
                </div>
            </Link>
        );
    }

    // VARIANT: STANDARD (Vertical Stack)
    return (
        <Link href={href} className="group flex flex-col h-full">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium">
                    <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wide text-[10px] ${badgeColor}`}>
                        {article.category}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{article.date}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3 leading-snug group-hover:text-brand-700 transition-colors">
                    {article.title}
                </h3>
                <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                </p>
            </div>
        </Link>
    );
}
