import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ['600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://berita.intanjayakab.go.id'),
  title: "Berita Intan Jaya - Portal Berita Pemerintah Kabupaten Intan Jaya",
  description: "Portal berita resmi Pemerintah Kabupaten Intan Jaya. Informasi terkini seputar pemerintahan, pembangunan, pendidikan, kesehatan, sosial budaya, ekonomi, dan keamanan.",
  keywords: "Intan Jaya, Kabupaten Intan Jaya, Berita Papua, Pemerintah Intan Jaya, Papua Tengah",
  authors: [{ name: "Pemerintah Kabupaten Intan Jaya" }],
  openGraph: {
    title: "Berita Intan Jaya",
    description: "Portal berita resmi Pemerintah Kabupaten Intan Jaya",
    url: 'https://berita.intanjayakab.go.id',
    siteName: 'Berita Intan Jaya',
    type: "website",
    locale: 'id_ID',
    images: [
      {
        url: '/images/default-og.png',
        width: 1200,
        height: 630,
        alt: 'Berita Intan Jaya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berita Intan Jaya',
    description: 'Portal Berita Resmi Pemkab Intan Jaya',
    images: ['/images/default-og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
