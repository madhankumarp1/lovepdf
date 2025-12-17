"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, LogOut, Copy, Shield, Mail, HardDrive, FileCheck, CreditCard, Sparkles, Briefcase, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface FileRecord {
    id: string;
    name: string;
    url: string;
    size: number;
    created_at: string;
}

export default function ProfilePage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [recentFiles, setRecentFiles] = useState<FileRecord[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) router.push('/');
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchRecentFiles();
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
            if (data) setProfile(data);
        } catch (e) { console.error(e); }
    };

    const fetchRecentFiles = async () => {
        try {
            const { data, error } = await supabase.from('files').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(20);
            if (error) throw error;
            setRecentFiles(data || []);
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleDelete = async (fileId: string, filePath: string) => {
        if (!confirm('Delete this file?')) return;
        try {
            const file = recentFiles.find(f => f.id === fileId);
            if (!file) return;
            await supabase.storage.from('user-files').remove([`${user!.id}/${file.name}`]);
            await supabase.from('files').delete().eq('id', fileId);
            setRecentFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (e) { alert('Failed to delete'); }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const s = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>;
    }

    const tier = profile?.tier || 'free';
    const isPro = tier === 'pro';
    const isBusiness = tier === 'business';
    const isFree = tier === 'free';

    const totalFiles = recentFiles.length;
    const totalStorage = formatFileSize(recentFiles.reduce((a, b) => a + (b.size || 0), 0));

    // Simple Color Logic
    const accentColor = isBusiness ? 'text-purple-600' : isPro ? 'text-amber-600' : 'text-rose-600';

    // Backgrounds & Gradients
    const pageBg = isBusiness ? 'bg-purple-50' : isPro ? 'bg-amber-50' : 'bg-gray-50';
    const bannerGradient = isBusiness
        ? 'from-purple-600 via-indigo-600 to-blue-600'
        : isPro
            ? 'from-amber-400 via-orange-500 to-rose-500'
            : 'from-gray-100 to-gray-200';

    const bgColor = isBusiness ? 'bg-purple-100' : isPro ? 'bg-amber-100' : 'bg-rose-100';
    const borderColor = isBusiness ? 'border-purple-200' : isPro ? 'border-amber-200' : 'border-rose-200';
    const textColor = isBusiness ? 'text-purple-700' : isPro ? 'text-amber-700' : 'text-gray-700';

    return (
        <div className={`min-h-screen ${pageBg} transition-colors duration-500 pb-12`}>
            {/* Top Banner */}
            <div className={`h-64 w-full bg-gradient-to-r ${bannerGradient} relative`}>
                <div className="absolute inset-0 bg-black/5"></div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl -mt-32 relative z-10">
                {/* Header Section (Simple) */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 mb-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${bgColor} ${accentColor} border-2 ${borderColor} shadow-sm`}>
                            {user.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Dashboard</h1>
                            <div className="flex items-center gap-3">
                                <p className="text-gray-500 font-medium">{user.email}</p>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border ${bgColor} ${accentColor} ${borderColor} translate-y-[1px]`}>
                                    {tier} Plan
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs mt-2 font-mono">ID: {user.id}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-gray-900 border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        Sign Out
                    </button>
                </div>

                {/* Stats Grid (New Feature, Clean Look) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <FileCheck className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase">Files Processed</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalFiles}</p>
                    </div>
                    <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <HardDrive className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase">Storage Used</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalStorage}</p>
                    </div>
                    <div className={`p-6 border rounded-2xl flex flex-col justify-center ${bgColor} ${borderColor}`}>
                        <div className={`flex items-center gap-3 mb-2 ${accentColor}`}>
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">Current Plan</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className={`text-3xl font-bold ${accentColor}`}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
                            {isFree && <Link href="/pricing" className="text-xs bg-white px-3 py-1 rounded-full font-bold shadow-sm hover:shadow-md transition-shadow">Upgrade</Link>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Files List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Recent Files
                        </h2>

                        {recentFiles.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 mb-4">No files found.</p>
                                <Link href="/" className="text-rose-600 font-bold hover:underline">Merge a PDF to get started</Link>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                {recentFiles.map((file, i) => (
                                    <div key={file.id} className={`p-4 flex items-center justify-between group ${i !== recentFiles.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a href={file.url} download target="_blank" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <button onClick={() => handleDelete(file.id, file.url)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Upgrade / Info */}
                    <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                        {isFree && (
                            <div className="p-6 rounded-2xl border border-rose-100 bg-rose-50/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Go Pro</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    Unlock unlimited file sizes and priority support.
                                </p>
                                <Link href="/pricing" className="block w-full py-2.5 bg-rose-600 text-white text-center font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm">
                                    Upgrade Now
                                </Link>
                            </div>
                        )}

                        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm w-full">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Details</h3>
                            <div className="space-y-4">
                                <div className="group">
                                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                    <p className="font-medium text-gray-900 break-all">{user.email}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm py-2 border-t border-gray-50">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="pt-2 border-t border-gray-50">
                                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-xs text-gray-600 border border-gray-100">
                                        <code className="truncate flex-1 font-mono">{user.id}</code>
                                        <button onClick={() => navigator.clipboard.writeText(user.id)} className="ml-2 text-gray-400 hover:text-gray-900 p-1 hover:bg-gray-200 rounded transition-colors" title="Copy ID">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
