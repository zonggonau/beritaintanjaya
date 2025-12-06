'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface NewsPaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function NewsPagination({ totalPages, currentPage }: NewsPaginationProps) {
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `/all-news?${params.toString()}`;
    };

    const pages = useMemo(() => {
        const p: (number | string)[] = [];
        // Always show first page
        p.push(1);

        // Logic to show ranges with ellipsis
        // If current page is far from start, add dots
        if (currentPage > 3) p.push('...');

        // Neighborhood of current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            p.push(i);
        }

        // If current page is far from end, add dots
        if (currentPage < totalPages - 2) p.push('...');

        // Always show last page if more than 1 page
        if (totalPages > 1) p.push(totalPages);

        // Dedup logic if simplistic loop added duplicates (rare with this logic but good to align)
        return Array.from(new Set(p)).sort((a, b) => {
            if (typeof a === 'string') return 1; // move dots to appropriate place? No, this sort is risky for dots.
            if (typeof b === 'string') return -1;
            return (a as number) - (b as number);
        }).map((x, _i, arr) => {
            // Correct dots placement manually
            return x;
        });

    }, [totalPages, currentPage]);

    // Simpler pagination logic for generated array to avoid complexity bugs
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pageNumbers;
    };

    const pageList = getPageNumbers();

    if (totalPages <= 1) return null;

    return (
        <div className="mt-16 flex justify-center">
            <nav className="flex items-center gap-2" aria-label="Pagination">
                <Link
                    href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                    className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors
                        ${currentPage > 1
                            ? 'text-gray-700 bg-white hover:bg-gray-50'
                            : 'text-gray-300 pointer-events-none bg-gray-50'
                        }`}
                    aria-disabled={currentPage <= 1}
                >
                    ← Sebelumnya
                </Link>

                {pageList.map((page, index) => {
                    if (page === '...') {
                        return <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>;
                    }

                    const p = page as number;
                    const isActive = p === currentPage;

                    return (
                        <Link
                            key={p}
                            href={createPageURL(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border
                                ${isActive
                                    ? 'bg-brand-700 text-white border-brand-700'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {p}
                        </Link>
                    );
                })}

                <Link
                    href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                    className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors
                        ${currentPage < totalPages
                            ? 'text-gray-700 bg-white hover:bg-gray-50'
                            : 'text-gray-300 pointer-events-none bg-gray-50'
                        }`}
                    aria-disabled={currentPage >= totalPages}
                >
                    Berikutnya →
                </Link>
            </nav>
        </div>
    );
}
