'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function NewsFilter({ totalPosts }: { totalPosts: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current values from URL or defaults
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'newest';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            // Reset page to 1 when filter changes
            if (name !== 'page') {
                params.delete('page');
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        router.push(`/all-news?${createQueryString('category', value)}`);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        router.push(`/all-news?${createQueryString('sort', value)}`);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-bold text-gray-900">{totalPosts}</span> artikel ditemukan
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="category-filter" className="text-sm font-medium text-gray-600">
                    Kategori:
                </label>
                <select
                    id="category-filter"
                    value={currentCategory}
                    onChange={handleCategoryChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                    <option value="">Semua Kategori</option>
                    <option value="pemerintahan">Pemerintahan</option>
                    <option value="pembangunan">Pembangunan</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="kesehatan">Kesehatan</option>
                    <option value="ekonomi">Ekonomi</option>
                    <option value="sosial-budaya">Sosial & Budaya</option>
                    <option value="keamanan">Keamanan</option>
                </select>

                <label htmlFor="sort-filter" className="text-sm font-medium text-gray-600 ml-2">
                    Urutkan:
                </label>
                <select
                    id="sort-filter"
                    value={currentSort}
                    onChange={handleSortChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="popular">Terpopuler</option>
                </select>
            </div>
        </div>
    );
}
