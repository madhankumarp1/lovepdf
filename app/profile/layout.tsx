import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Profile | DocMorph',
    description: 'Manage your DocMorph account settings.',
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
