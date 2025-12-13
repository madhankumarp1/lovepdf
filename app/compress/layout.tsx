import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compress PDF - Reduce PDF File Size Online',
    description: 'Reduce the size of your PDF files online while maintaining best quality. 100% free.',
    openGraph: {
        title: 'Compress PDF - Reduce PDF File Size Online',
        description: 'Reduce the size of your PDF files online while maintaining best quality. 100% free.',
        url: 'https://lovepdf-dun.vercel.app/compress',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
