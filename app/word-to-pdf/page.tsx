import type { Metadata } from 'next';
import WordToPdfClient from './client';

export const metadata: Metadata = {
    title: 'Word to PDF | Best Free Online DOCX to PDF Converter',
    description: 'Convert Word to PDF online for free. The best tool to convert DOC and DOCX to PDF. Fast, easy, and secure. No registration required.',
    keywords: [
        'word to pdf',
        'convert word to pdf',
        'doc to pdf',
        'docx to pdf',
        'word to pdf converter',
        'free word to pdf',
        'online pdf converter',
        'best word to pdf converter',
        'microsoft word to pdf'
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
