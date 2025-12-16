import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Donate - Support DocMorph',
    description: 'Support DocMorph to keep the tools free and running. Your donation helps us improve the service.',
    openGraph: {
        title: 'Donate - Support DocMorph',
        description: 'Support DocMorph to keep the tools free and running. Your donation helps us improve the service.',
        url: 'https://docmorph.online/donate',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
