"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User as UserIcon, Shield, Mail, Calendar, CreditCard, Sparkles, ChevronRight } from 'lucide-react';
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
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (!user) return null;

    // Format date
    const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
                {/* Glassmorphism Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden relative">

                    {/* Decorative Gradient Blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-gray-100 flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500">Manage your account details and subscription.</p>
                        </div>
                    </div>

                    {/* Horizontal List Items */}
                    <div className="px-6 py-2">

                        {/* Email Row */}
                        <div className="py-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email</p>
                                    <p className="font-semibold text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                Verified
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Plan Row */}
                        <div className="py-5 flex items-center justify-between group hover:bg-white/40 transition-colors -mx-6 px-6 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Subscription</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900">Free Plan</p>
                                        <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    </div>
                                </div>
                            </div>
                            <Link href="/pricing" className="text-rose-600 text-sm font-bold hover:underline flex items-center gap-1">
                                Upgrade <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Member Since Row */}
                        <div className="py-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Member Since</p>
                                    <p className="font-semibold text-gray-900">{memberSince}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* User ID Row */}
                        <div className="py-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">User ID</p>
                                    <code className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">{user.id}</code>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer / Logout */}
                    <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
