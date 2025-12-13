import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Donate - Support Love PDF',
    description: 'Support Love PDF to keep the tools free and running. Your donation helps us improve the service.',
    openGraph: {
        title: 'Donate - Support Love PDF',
        description: 'Support Love PDF to keep the tools free and running. Your donation helps us improve the service.',
        url: 'https://lovepdf-dun.vercel.app/donate',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
