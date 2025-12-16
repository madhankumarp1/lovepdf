import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Split PDF file | DocMorph',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    openGraph: {
        title: 'Split PDF file | DocMorph',
        description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    },
};

export default function SplitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
