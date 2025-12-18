import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DocMorph | Free Online PDF Tools - Merge, Split, Compress & Convert',
    template: '%s | DocMorph'
  },
  description: '100% Free online PDF tools. Merge PDF, Split PDF, Compress PDF, Convert Word to PDF, PDF to Word, and more. Easy, fast, and secure.',
  keywords: [
    'merge pdf', 'combine pdf', 'join pdf',
    'split pdf', 'extract pdf pages', 'separate pdf',
    'compress pdf', 'reduce pdf size', 'optimize pdf',
    'pdf to word', 'convert pdf to doc', 'pdf to docx',
    'word to pdf', 'doc to pdf',
    'pdf to jpg', 'convert pdf to image',
    'free pdf tools', 'online pdf converter', 'docmorph',
    'edit pdf', 'rotate pdf', 'unlock pdf'
  ],
  authors: [{ name: 'Madhankumar' }],
  creator: 'Madhankumar',
  publisher: 'DocMorph',
  metadataBase: new URL('https://docmorph.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docmorph.online',
    title: 'DocMorph | Free Online PDF Tools',
    description: 'Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, Split, Compress, Convert and more.',
    siteName: 'DocMorph',
    images: [
      {
        url: '/og-image.jpg', // Ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: 'DocMorph PDF Tools',
      },
    ],
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
