import type { Metadata } from 'next';
import CompressClient from './client';

export const metadata: Metadata = {
    title: 'Compress PDF | Reduce PDF File Size Online for Free',
    description: 'Compress PDF files online to reduce file size while maintaining expert quality. 100% Free PDF compressor.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'optimize pdf', 'pdf compressor', 'resize pdf'],
    alternates: {
        canonical: '/compress',
    },
    openGraph: {
        title: 'Compress PDF | Reduce PDF File Size Online for Free',
        description: 'Compress PDF files online for free. Reduce size simply.',
        url: 'https://docmorph.online/compress',
        images: [
            {
                url: '/og-compress.jpg',
                width: 1200,
                height: 630,
                alt: 'Compress PDF Tool',
            },
        ],
    },
};

export default function CompressPage() {
    return <CompressClient />;
}
