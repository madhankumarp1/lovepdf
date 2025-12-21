import type { Metadata } from 'next';
import WordToPdfClient from './client';

export const metadata: Metadata = {
    title: 'Word to PDF | Best Free Online DOCX to PDF Converter',
    description: 'Convert Word to PDF online for free. The best tool to convert DOC and DOCX to PDF. Fast, easy, and secure. No registration required.',
    keywords: [
        'free word to pdf online',
        'word to pdf without watermark',
        'simple word to pdf converter',
        'fast word to pdf online',
        'convert word to pdf free',
        'word to pdf online tool',
        'doc to pdf converter online',
        'secure word to pdf converter'
    ],
    alternates: {
        canonical: '/word-to-pdf',
    },
    openGraph: {
        title: 'Word to PDF | Best Free Online DOCX to PDF Converter',
        description: 'Convert Word to PDF online for free. Fast, easy, and secure conversion.',
        url: 'https://docmorph.online/word-to-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Best Word to PDF Converter',
            },
        ],
    },
};

export default function WordToPdfPage() {
    return <WordToPdfClient />;
}
