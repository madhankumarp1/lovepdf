import { Construction } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
    title: string;
    description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <div className="inline-block p-6 rounded-full bg-gray-50 mb-8 animate-bounce">
                <Construction className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                {description}
            </p>
            <Link href="/" className="px-8 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                Back to Home
            </Link>
        </div>
    );
}
