import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Merge PDF files | DocMorph',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    openGraph: {
        title: 'Merge PDF files | DocMorph',
        description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    },
};

export default function MergeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
