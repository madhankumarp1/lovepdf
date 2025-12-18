import { ComingSoon } from '@/components/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Status | DocMorph',
    description: 'Check status of DocMorph services.',
};

export default function StatusPage() {
    return (
        <ComingSoon
            title="System Status"
            description="All systems are currently operational. A detailed status dashboard is coming soon."
        />
    );
}
