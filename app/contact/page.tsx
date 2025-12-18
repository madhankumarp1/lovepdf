import { ComingSoon } from '@/components/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | DocMorph',
    description: 'Contact DocMorph support.',
};

export default function ContactPage() {
    return (
        <ComingSoon
            title="Contact Us - Coming Soon"
            description="Our contact form is currently under maintenance. You can reach out to us on social media in the meantime."
        />
    );
}
