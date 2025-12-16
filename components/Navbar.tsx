"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { LoginModal } from './LoginModal';

export function Navbar() {
    const { user, loading } = useUser();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
            window.location.reload();
        }
    }

    return (
        <>
            <nav className="border-b bg-white sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-600 transition-transform hover:scale-105">
                        <Heart className="fill-current w-6 h-6" />
                        <span>DocMorph</span>
                    </Link>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                        <Link href="/merge" className="hover:text-rose-600 transition-colors">Merge PDF</Link>
                        <Link href="/split" className="hover:text-rose-600 transition-colors">Split PDF</Link>
                        <Link href="/compress" className="hover:text-rose-600 transition-colors">Compress PDF</Link>
                        <Link href="/donate" className="hover:text-rose-600 transition-colors font-medium text-rose-600">Donate</Link>
                    </div>

                    <div className="flex gap-4 items-center">
                        {!loading && (
                            user ? (
                                <div className="flex items-center gap-4">
                                    <Link href="/profile" className="text-sm text-gray-700 hidden sm:inline hover:text-rose-600 transition-colors font-medium">
                                        Hi, {user.email?.split('@')[0]}
                                    </Link>
                                    <button onClick={handleLogout} className="text-sm font-semibold hover:text-rose-600">Log out</button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => setIsLoginOpen(true)} className="text-sm font-semibold hover:text-rose-600">Log in</button>
                                    <button onClick={() => setIsLoginOpen(true)} className="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg transform active:scale-95">Sign up</button>
                                </>
                            )
                        )}
                    </div>
                </div>
            </nav>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}
