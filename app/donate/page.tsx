import { Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Donate | DocMorph',
    description: 'Support DocMorph development.',
};

export default function DonatePage() {
    return (
        <div className="container mx-auto px-4 py-32 text-center">
            <div className="inline-block p-6 rounded-full bg-rose-50 mb-8 animate-bounce">
                <Heart className="w-16 h-16 text-rose-600 fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Donations Coming Soon
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Thank you for your interest in supporting us!
                <br />
                We are setting up our donation systems. Please check back later.
            </p>
        </div>
    );
}
