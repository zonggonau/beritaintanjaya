'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const categories = [
    { name: 'Pemerintahan', slug: 'pemerintahan' },
    { name: 'Pembangunan', slug: 'pembangunan' },
    { name: 'Pendidikan', slug: 'pendidikan' },
    { name: 'Kesehatan', slug: 'kesehatan' },
    { name: 'Sosial & Budaya', slug: 'sosial-budaya' },
    { name: 'Ekonomi', slug: 'ekonomi' },
    { name: 'Keamanan', slug: 'keamanan' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dateString, setDateString] = useState('');

    // Handle scroll effect & set date
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Set date on client side only to avoid hydration mismatch
        setDateString(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-0' : 'py-0 border-b border-gray-100'}`}>

                {/* Top Utility Bar (Hidden on Scroll / Mobile) */}
                {!isScrolled && (
                    <div className="bg-brand-900 text-white text-xs py-1.5 hidden md:block transition-all">
                        <div className="container-wide flex justify-between items-center">
                            <span className="opacity-90 tracking-wide font-medium">Kabupaten Intan Jaya, Papua Tengah</span>
                            <span className="opacity-80">
                                {dateString}
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Header */}
                <div className="container-wide">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                                <img src="/logo.png" alt="Logo Intan Jaya" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="font-display font-bold text-xl md:text-2xl leading-none text-gray-900 group-hover:text-brand-700 transition-colors tracking-tight">
                                    Berita Intan Jaya
                                </h1>
                                <span className="text-[11px] md:text-xs text-gray-500 font-medium tracking-widest uppercase mt-1 group-hover:text-brand-600/80 transition-colors">Portal Resmi Pemerintah</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center gap-1">
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/kategori/${category.slug}`}
                                    className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-all uppercase tracking-wide"
                                >
                                    {category.name}
                                </Link>
                            ))}
                            <Link href="/all-news" className="ml-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-black transition-colors">
                                Semua Berita
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="xl:hidden p-2 text-gray-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-24 pb-8 px-6 overflow-y-auto xl:hidden">
                    <nav className="flex flex-col gap-2">
                        <Link href="/" className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3" onClick={() => setIsMobileMenuOpen(false)}>
                            Beranda
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/kategori/${category.slug}`}
                                className="text-lg font-medium text-gray-600 py-2 hover:text-brand-700 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link href="/all-news" className="mt-4 text-lg font-bold text-brand-700 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Lihat Arsip Berita &rarr;
                        </Link>
                    </nav>
                </div>
            )}

            {/* Spacer to prevent content jumping */}
            <div className={`h-[${isScrolled ? '64px' : '96px'}] transition-all md:h-24`}></div>
        </>
    );
}
