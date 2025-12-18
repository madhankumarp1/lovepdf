import { ComingSoon } from '@/components/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Help Center | DocMorph',
    description: 'Get help with DocMorph PDF tools.',
};

export default function HelpPage() {
    return (
        <ComingSoon
            title="Help Center Coming Soon"
            description="We are building a comprehensive help center to answer all your questions. For now, please contact us directly if you need assistance."
        />
    );
}
