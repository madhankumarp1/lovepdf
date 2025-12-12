import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-50 py-12 mt-auto border-t">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800 mb-4">
                    <span>Love PDF</span>
                </div>
                <p className="text-gray-500 mb-4">Making PDF tools easy and accessible for everyone.</p>
                <p className="flex items-center justify-center gap-1 text-sm text-gray-400">
                    Made with <Heart className="w-4 h-4 text-rose-500 fill-current" /> by Madhankumar
                </p>
            </div>
        </footer>
    );
}
