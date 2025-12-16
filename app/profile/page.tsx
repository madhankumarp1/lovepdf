"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User as UserIcon, Shield, Mail, Calendar, CreditCard, HardDrive, Sparkles } from 'lucide-react';
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
            <div className="max-w-3xl mx-auto">
                {/* Glassmorphism Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative">

                    {/* Decorative Gradient Blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header Background */}
                    <div className="h-40 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 relative">
                        <div className="absolute -bottom-16 left-10">
                            <div className="w-32 h-32 bg-white/30 backdrop-blur-sm rounded-full p-2 shadow-xl">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-rose-100 shadow-inner overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-600"></div>
                                    <span className="relative text-4xl font-bold uppercase">
                                        {user.email?.[0] || 'U'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-10 px-10 relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">My Account</h1>
                                <p className="text-gray-500">Manage your subscription and preferences</p>
                            </div>
                            <div className="px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-bold rounded-full flex items-center gap-2 border border-rose-200">
                                <Sparkles className="w-4 h-4" />
                                Free Plan
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Email Section */}
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address</p>
                                    <p className="text-gray-900 font-semibold truncate max-w-[200px]" title={user.email}>{user.email}</p>
                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Verified
                                    </span>
                                </div>
                            </div>

                            {/* Member Since Section */}
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Member Since</p>
                                    <p className="text-gray-900 font-semibold">{memberSince}</p>
                                    <p className="text-xs text-gray-500 mt-1">DocMorph User</p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Section */}
                        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform transform group-hover:scale-110 duration-700"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                        <CreditCard className="w-8 h-8 text-rose-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Standard Free Plan</h3>
                                        <p className="text-gray-400 text-sm">Upgrade to unlock unlimited PDF tools</p>
                                    </div>
                                </div>
                                <Link href="/pricing" className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-rose-500/30 whitespace-nowrap">
                                    Upgrade Pro
                                </Link>
                            </div>
                        </div>

                        {/* Recent Files Placeholder */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HardDrive className="w-5 h-5 text-gray-500" />
                                My Recent Files
                            </h3>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <HardDrive className="w-8 h-8" />
                                </div>
                                <p className="text-gray-900 font-medium">No files stored yet</p>
                                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                    Files you process will not be stored permanently here for security reasons, unless you save them.
                                </p>
                            </div>
                        </div>

                        <hr className="my-8 border-gray-100" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
                                <p className="font-bold text-gray-700 mb-1">User ID</p>
                                <code className="break-all">{user.id}</code>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 group"
                            >
                                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
