import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF to Word Converter - Convert PDF to Docx Online',
    description: 'Convert your PDF to WORD documents with incredible accuracy. 100% free.',
    openGraph: {
        title: 'PDF to Word Converter - Convert PDF to Docx Online',
        description: 'Convert your PDF to WORD documents with incredible accuracy. 100% free.',
        url: 'https://lovepdf-dun.vercel.app/pdf-to-word',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
