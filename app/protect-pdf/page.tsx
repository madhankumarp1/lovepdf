import type { Metadata } from 'next';
import ProtectPdfClient from './client';

export const metadata: Metadata = {
    title: 'Protect PDF | Encrypt PDF with Password Online',
    description: 'Secure your PDF files with a password. Encrypt PDF documents online for free to prevent unauthorized access.',
    keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf', 'secure pdf', 'lock pdf', 'pdf security'],
    alternates: {
        canonical: '/protect-pdf',
    },
    openGraph: {
        title: 'Protect PDF | Encrypt PDF with Password',
        description: 'Secure your PDF files with a password. Encrypt PDF documents online for free.',
        url: 'https://docmorph.online/protect-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Protect PDF Tool',
            },
        ],
    },
};

export default function ProtectPdfPage() {
    return <ProtectPdfClient />;
}
