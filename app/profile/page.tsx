"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, Mail, Calendar, CreditCard, Sparkles, ChevronRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
            window.location.href = '/';
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (!user) return null;

    // Format date
    const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    return (
        // Use calc(100vh - navbar_height) to fit exactly without scroll
        <div className="h-[calc(100vh-64px)] p-2 md:p-6 bg-gray-50/50 overflow-hidden flex flex-col">
            <div className="w-full h-full max-w-7xl mx-auto">
                {/* Glassmorphism Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden relative flex flex-col h-full">

                    {/* Decorative Gradient Blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Compact Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center gap-5 bg-gradient-to-r from-rose-50/50 to-white/50">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
                            {user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-gray-900 truncate">My Profile</h1>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-rose-200 shrink-0">
                            <Sparkles className="w-3 h-3" />
                            Free
                        </div>
                    </div>

                    {/* Scrollable Content Area (if screen is very small) */}
                    <div className="flex-1 overflow-y-auto px-6 py-2">

                        {/* Email Row - Compact */}
                        <div className="py-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Email</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 truncate max-w-[150px] sm:max-w-xs">{user.email}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Verified"></div>
                            </div>
                        </div>

                        <hr className="border-gray-50" />

                        {/* Plan Row - Compact */}
                        <div className="py-3 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 -mx-6 px-6 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Plan</span>
                            </div>
                            <Link href="/pricing" className="flex items-center gap-1 text-sm text-rose-600 font-medium hover:underline">
                                Free Plan <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <hr className="border-gray-50" />

                        {/* Member Since Row - Compact */}
                        <div className="py-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Joined</span>
                            </div>
                            <span className="text-sm text-gray-600">{memberSince}</span>
                        </div>

                        <hr className="border-gray-50" />

                        {/* ID Row - Compact */}
                        <div className="py-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">ID</span>
                            </div>
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono truncate max-w-[120px] sm:max-w-none">
                                {user.id}
                            </code>
                        </div>

                    </div>

                    {/* Footer / Logout */}
                    <div className="p-4 bg-gray-50/80 border-t border-gray-100 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
