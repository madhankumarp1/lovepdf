import type { Metadata } from 'next';
import SplitClient from './client';

export const metadata: Metadata = {
    title: 'Split PDF | Extract Pages from PDF Online',
    description: 'Split PDF files online. Extract one or multiple pages from your PDF documents. 100% Free and secure PDF splitter.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf', 'pdf splitter', 'remove pdf pages'],
    alternates: {
        canonical: '/split',
    },
    openGraph: {
        title: 'Split PDF | Extract Pages from PDF Online',
        description: 'Split PDF files online for free. Extract pages securely.',
        url: 'https://docmorph.online/split',
        images: [
            {
                url: '/og-split.jpg',
                width: 1200,
                height: 630,
                alt: 'Split PDF Tool',
            },
        ],
    },
};

export default function SplitPage() {
    return <SplitClient />;
}
