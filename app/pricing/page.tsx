import { Rocket } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing | DocMorph',
    description: 'Pricing plans for DocMorph.',
};

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-32 text-center">
            <div className="inline-block p-6 rounded-full bg-rose-50 mb-8 animate-pulse">
                <Rocket className="w-16 h-16 text-rose-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pricing Plans Coming Soon
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                We are working hard to bring you the best value for your needs.
                <br />
                In the meantime, enjoy all our tools for <strong>free!</strong>
            </p>
        </div>
    );
}
