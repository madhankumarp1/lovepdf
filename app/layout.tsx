import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DocMorph | Online PDF Tools for PDF Lovers',
    template: '%s | DocMorph'
  },
  description: 'Merge, Split, Compress, convert, rotate, unlock and watermark PDF files with just a few clicks. 100% Free and easy to use.',
  keywords: ['merge pdf', 'split pdf', 'compress pdf', 'convert pdf', 'pdf tools', 'free pdf tools', 'docmorph', 'ilovepdf clone'],
  authors: [{ name: 'Madhankumar' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docmorph.online',
    title: 'DocMorph | Online PDF Tools for PDF Lovers',
    description: 'Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!',
    siteName: 'DocMorph',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocMorph | Online PDF Tools',
    description: '100% Free PDF tools. Merge, Split, Compress and more.',
    creator: '@MadhanK48272026',
  },
  verification: {
    google: 'DgteCEDYckDWnfkSCKZfyJSx6MNzUPkj5G2v9PLzpO0',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
