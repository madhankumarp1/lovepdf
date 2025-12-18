import type { Metadata } from 'next';
import WatermarkPdfClient from './client';

export const metadata: Metadata = {
    title: 'Watermark PDF | Add Text Watermark Online',
    description: 'Add text watermarks to your PDF files. Secure your documents with custom stamps for free.',
    keywords: ['watermark pdf', 'add watermark', 'stamp pdf', 'pdf signature', 'text over pdf'],
    alternates: {
        canonical: '/watermark-pdf',
    },
    openGraph: {
        title: 'Watermark PDF | Add Text Watermark Online',
        description: 'Add text watermarks to your PDF files. Secure your documents with custom stamps for free.',
        url: 'https://docmorph.online/watermark-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Watermark PDF Tool',
            },
        ],
    },
};

export default function WatermarkPdfPage() {
    return <WatermarkPdfClient />;
}
