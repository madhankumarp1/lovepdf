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

                    {/* Vertical Grid Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* Email Card */}
                            <div className="p-5 bg-ros-50/10 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all shadow-sm hover:shadow-md group flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" title="Verified"></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-bold text-gray-900 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            {/* Plan Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all shadow-sm hover:shadow-md group flex flex-col gap-3 relative overflow-hidden">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <Link href="/pricing" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        Upgrade <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Plan</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-gray-900">Free Tier</p>
                                        <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Joined Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all shadow-sm hover:shadow-md group flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Joined</p>
                                    <p className="text-sm font-bold text-gray-900">{memberSince}</p>
                                </div>
                            </div>

                            {/* ID Card */}
                            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all shadow-sm hover:shadow-md group flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 bg-gray-200 text-gray-600 rounded-xl group-hover:bg-gray-800 group-hover:text-white transition-colors">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">User ID</p>
                                    <p className="text-xs font-mono text-gray-600 truncate bg-gray-100 p-1 rounded mt-1">{user.id}</p>
                                </div>
                            </div>

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
