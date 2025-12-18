import type { Metadata } from 'next';
import JpgToPdfClient from './client';

export const metadata: Metadata = {
    title: 'JPG to PDF | Convert Images to PDF Online',
    description: 'Convert JPG, PNG, and other images to PDF documents online for free. Combine multiple images into one PDF file.',
    keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'png to pdf', 'photos to pdf', 'online converter'],
    alternates: {
        canonical: '/jpg-to-pdf',
    },
    openGraph: {
        title: 'JPG to PDF | Convert Images to PDF Online',
        description: 'Convert JPG, PNG, and other images to PDF documents online for free.',
        url: 'https://docmorph.online/jpg-to-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'JPG to PDF Converter',
            },
        ],
    },
};

export default function JpgToPdfPage() {
    return <JpgToPdfClient />;
}
