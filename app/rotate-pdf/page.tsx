import type { Metadata } from 'next';
import RotatePdfClient from './client';

export const metadata: Metadata = {
    title: 'Rotate PDF | Rotate PDF Pages Online',
    description: 'Rotate PDF pages permanently. Rotate individual pages or the entire document online for free.',
    keywords: ['rotate pdf', 'rotate pdf pages', 'pdf rotator', 'change pdf orientation', 'turn pdf pages'],
    alternates: {
        canonical: '/rotate-pdf',
    },
    openGraph: {
        title: 'Rotate PDF | Rotate PDF Pages',
        description: 'Rotate PDF pages permanently. Rotate individual pages or the entire document online for free.',
        url: 'https://docmorph.online/rotate-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Rotate PDF Tool',
            },
        ],
    },
};

export default function RotatePdfPage() {
    return <RotatePdfClient />;
}
