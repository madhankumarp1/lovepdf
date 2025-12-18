import { ComingSoon } from '@/components/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy | DocMorph',
    description: 'Cookie Policy for DocMorph.',
};

export default function CookiesPage() {
    return (
        <ComingSoon
            title="Cookie Policy"
            description="Information about how we use cookies will be published here soon."
        />
    );
}
