import { Inter, Playfair_Display, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '600', '700', '900'] });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-reader', weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'PopularBooksOnline — The Blueprint Series for Newcomers to Canada',
  description: 'The Blueprint Series by Johana Baraka: New Canadian Blueprint, Identity Theft Protection, and Scan Whole Elephant. A warm, tactical three-volume field guide for newcomers to Canada. Read Chapter 1 free, then get the books on Amazon.ca in Kindle and Paperback.',
  keywords: ['new canadian blueprint', 'newcomers to canada', 'immigrant guide canada', 'identity theft protection canada', 'provincial nominee program guide', 'Johana Baraka', 'popularbooksonline'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'The Blueprint Series — From Green to Integrated',
    description: 'A three-volume field guide for newcomers navigating a brand-new life in Canada. Read Chapter 1 free. Available on Amazon Kindle & Paperback.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'PopularBooksOnline',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Blueprint Series — From Green to Integrated',
    description: 'Your blueprint for Canada. Read Chapter 1 free, then get the books on Amazon.ca.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${openSans.variable}`}>
      <body className="font-sans antialiased bg-[#f8f1e7] text-[#2b1d10]">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
