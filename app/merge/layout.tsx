import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Merge PDF - Combine PDF Files Online for Free',
    description: 'Select multiple PDF files and merge them in seconds. 100% free, secure and easy to use.',
    openGraph: {
        title: 'Merge PDF - Combine PDF Files Online for Free',
        description: 'Select multiple PDF files and merge them in seconds. 100% free, secure and easy to use.',
        url: 'https://lovepdf-dun.vercel.app/merge',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
