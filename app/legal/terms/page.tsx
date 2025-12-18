import { ComingSoon } from '@/components/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | DocMorph',
    description: 'Terms of Service for DocMorph.',
};

export default function TermsPage() {
    return (
        <ComingSoon
            title="Terms of Service"
            description="Our legal team is finalizing our Terms of Service. Please check back later."
        />
    );
}
