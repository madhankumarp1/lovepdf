import Link from 'next/link';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                            DocMorph
                        </Link>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://x.com/MadhanK48272026" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/madhankumarp1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://instagram.com/mannmadhannnn" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><Link href="/merge" className="hover:text-rose-600 transition-colors">Merge PDF</Link></li>
                            <li><Link href="/split" className="hover:text-rose-600 transition-colors">Split PDF</Link></li>
                            <li><Link href="/compress" className="hover:text-rose-600 transition-colors">Compress PDF</Link></li>
                            <li><Link href="/pricing" className="hover:text-rose-600 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><Link href="/donate" className="hover:text-rose-600 transition-colors">Donate</Link></li>
                            <li><Link href="/help" className="hover:text-rose-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-rose-600 transition-colors">Contact Us</Link></li>
                            <li><Link href="/status" className="hover:text-rose-600 transition-colors">Status</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><Link href="/legal/terms" className="hover:text-rose-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-rose-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-rose-600 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 text-center">
                    <p className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                        Made with <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> by Madhankumar
                        <span className="mx-2">•</span>
                        © {new Date().getFullYear()} DocMorph
                    </p>
                </div>
            </div>
        </footer>
    );
}
