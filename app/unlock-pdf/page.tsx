import type { Metadata } from 'next';
import UnlockPdfClient from './client';

export const metadata: Metadata = {
    title: 'Unlock PDF | Remove PDF Password Online',
    description: 'Remove password security from PDF files. Unlock PDF documents online for free to print, copy, or edit.',
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf unlocker', 'open secured pdf'],
    alternates: {
        canonical: '/unlock-pdf',
    },
    openGraph: {
        title: 'Unlock PDF | Remove PDF Password',
        description: 'Remove password security from PDF files. Unlock PDF documents online for free.',
        url: 'https://docmorph.online/unlock-pdf',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Unlock PDF Tool',
            },
        ],
    },
};

export default function UnlockPdfPage() {
    return <UnlockPdfClient />;
}
