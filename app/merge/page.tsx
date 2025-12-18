import type { Metadata } from 'next';
import MergeClient from './client';

export const metadata: Metadata = {
    title: 'Merge PDF | Combine PDF Files Online for Free',
    description: 'Merge multiple PDF files into one document in seconds. 100% Free, secure, and easy to use with DocMorph. No installation required.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf', 'merge pdf files', 'pdf merger', 'combine pdf online'],
    alternates: {
        canonical: '/merge',
    },
    openGraph: {
        title: 'Merge PDF | Combine PDF Files Online for Free',
        description: 'Merge multiple PDF files into one document in seconds. 100% Free and secure.',
        url: 'https://docmorph.online/merge',
        images: [
            {
                url: '/og-merge.jpg', // Ensure you have specific images if possible, or fallback to main
                width: 1200,
                height: 630,
                alt: 'Merge PDF Tools',
            },
        ],
    },
};

export default function MergePage() {
    return <MergeClient />;
}
