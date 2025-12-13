import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Split PDF - Separate PDF Pages Online',
    description: 'Split PDF files into individual pages or extract specific pages. 100% free and easy to use.',
    openGraph: {
        title: 'Split PDF - Separate PDF Pages Online',
        description: 'Split PDF files into individual pages or extract specific pages. 100% free and easy to use.',
        url: 'https://lovepdf-dun.vercel.app/split',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
