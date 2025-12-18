import { ComingSoon } from '@/components/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | DocMorph',
    description: 'Privacy Policy for DocMorph.',
};

export default function PrivacyPage() {
    return (
        <ComingSoon
            title="Privacy Policy"
            description="We respect your privacy. Our detailed Privacy Policy is being updated and will be available soon."
        />
    );
}
