import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing | Love PDF',
    description: 'Choose the best plan for all your PDF needs. Free, Pro and Business options available.',
    openGraph: {
        title: 'Pricing | Love PDF - Affordable Tools',
        description: 'Get unlimited access to all PDF tools with our simple pricing plans.',
    },
};

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
