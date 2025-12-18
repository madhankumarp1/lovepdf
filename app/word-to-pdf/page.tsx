import type { Metadata } from 'next';
import WordToPdfClient from './client';

export const metadata: Metadata = {
    title: 'Word to PDF | Convert DOCX to PDF Online',
    description: 'Convert DOC and DOCX files to PDF documents online for free. Accurate Word to PDF conversion.',
    keywords: ['word to pdf', 'doc to pdf', 'docx to pdf', 'convert word to pdf', 'word converter'],
    alternates: {
        canonical: '/word-to-pdf',
    },
    openGraph: {
        title: 'Word to PDF | Convert DOCX to PDF Online',
        description: 'Convert DOC and DOCX files to PDF documents online for free.',
        url: 'https://docmorph.online/word-to-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Word to PDF Tool',
            },
        ],
    },
};

export default function WordToPdfPage() {
    return <WordToPdfClient />;
}
