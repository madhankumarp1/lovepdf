"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User as UserIcon, Shield, Mail } from 'lucide-react';

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

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-rose-500 to-rose-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <UserIcon className="w-12 h-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

                        <div className="space-y-6">
                            {/* Email Section */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Mail className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                                    <p className="text-gray-900 font-semibold">{user.email}</p>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                    Verified
                                </div>
                            </div>

                            {/* ID Section */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Shield className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-1">User ID</p>
                                    <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 block mt-1 w-fit">
                                        {user.id}
                                    </code>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <button
                                onClick={handleLogout}
                                className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent transition-all flex items-center justify-center gap-2 group"
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
