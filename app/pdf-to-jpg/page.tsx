import type { Metadata } from 'next';
import PdfToJpgClient from './client';

export const metadata: Metadata = {
    title: 'PDF to JPG | Convert PDF Pages to Images Online',
    description: 'Convert PDF files to high quality JPG images. Extract images from PDF or convert pages to JPG. 100% Free and secure.',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'save pdf as image', 'pdf to jpeg', 'pdf converter'],
    alternates: {
        canonical: '/pdf-to-jpg',
    },
    openGraph: {
        title: 'PDF to JPG | Convert PDF Pages to Images Online',
        description: 'Convert PDF pages to JPG images for free.',
        url: 'https://docmorph.online/pdf-to-jpg',
        images: [
            {
                url: '/og-pdf-to-jpg.jpg',
                width: 1200,
                height: 630,
                alt: 'PDF to JPG Converter',
            },
        ],
    },
};

export default function PdfToJpgPage() {
    return <PdfToJpgClient />;
}
