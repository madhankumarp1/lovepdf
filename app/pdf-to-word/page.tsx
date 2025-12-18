import type { Metadata } from 'next';
import PdfToWordClient from './client';

export const metadata: Metadata = {
    title: 'PDF to Word | Convert PDF to Docx Online',
    description: 'Convert PDF to Word documents online for free. Accurate PDF to DOCX conversion. Edit your PDFs easily.',
    keywords: ['pdf to word', 'pdf to doc', 'pdf to docx', 'convert pdf to word', 'pdf converter', 'edit pdf'],
    alternates: {
        canonical: '/pdf-to-word',
    },
    openGraph: {
        title: 'PDF to Word | Convert PDF to Docx Online',
        description: 'Convert PDF files to editable Word documents for free.',
        url: 'https://docmorph.online/pdf-to-word',
        images: [
            {
                url: '/og-pdf-to-word.jpg',
                width: 1200,
                height: 630,
                alt: 'PDF to Word Converter',
            },
        ],
    },
};

export default function PdfToWordPage() {
    return <PdfToWordClient />;
}
