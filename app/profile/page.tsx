"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, LogOut, Upload, User as UserIcon, Settings, CreditCard, Clock, Shield, Sparkles, Mail, Calendar, Copy, Briefcase, HardDrive, FileCheck } from 'lucide-react';
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
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchRecentFiles();
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user!.id)
                .single();

            if (data) setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchRecentFiles = async () => {
        setErrorMsg(null);
        try {
            const { data, error } = await supabase
                .from('files')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setRecentFiles(data || []);
        } catch (error: any) {
            console.error('Error fetching files:', error);
            setErrorMsg(error.message || 'Failed to load files');
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleDelete = async (fileId: string, filePath: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const fileToDelete = recentFiles.find(f => f.id === fileId);
            if (!fileToDelete) return;

            const storagePath = `${user!.id}/${fileToDelete.name}`;

            const { error: storageError } = await supabase.storage
                .from('user-files')
                .remove([storagePath]);

            if (storageError) {
                console.error('Storage delete error:', storageError);
            }

            const { error: dbError } = await supabase
                .from('files')
                .delete()
                .eq('id', fileId);

            if (dbError) throw dbError;

            setRecentFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleLogout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
            window.location.href = '/';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (!user) return null;

    // Derived State
    const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });
    const tier = profile?.tier || 'free';
    const isPro = tier === 'pro';
    const isBusiness = tier === 'business';
    const isFree = tier === 'free';

    // Stats calculation
    const totalFiles = recentFiles.length;
    const totalSize = recentFiles.reduce((acc, file) => acc + (file.size || 0), 0);
    const totalSizeFormatted = formatFileSize(totalSize);

    // Theme Config
    let themeColor = 'rose';
    let gradientBg = 'from-rose-500 to-rose-600';
    let badgeBg = 'bg-rose-100 text-rose-700';

    if (isPro) {
        themeColor = 'amber';
        gradientBg = 'from-amber-500 to-orange-500';
        badgeBg = 'bg-amber-100 text-amber-700 border-amber-200';
    } else if (isBusiness) {
        themeColor = 'purple';
        gradientBg = 'from-purple-600 to-indigo-600';
        badgeBg = 'bg-purple-100 text-purple-700 border-purple-200';
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 overflow-x-hidden pt-20">

            {/* Hero Section */}
            <div className={`relative ${isFree ? 'bg-white' : `bg-gradient-to-r ${gradientBg}`} pb-32 pt-12 overflow-hidden`}>
                {!isFree && (
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black rounded-full blur-3xl"></div>
                    </div>
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-white ${isFree ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500' : 'bg-white/20 backdrop-blur-md text-white'}`}>
                                {user.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                        </div>

                        <div className={`text-center md:text-left ${!isFree ? 'text-white' : 'text-gray-900'}`}>
                            <h1 className="text-4xl font-bold tracking-tight mb-2">My Dashboard</h1>
                            <p className={`text-lg opacity-90 font-medium mb-4`}>{user.email}</p>

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div className={`inline-flex px-4 py-1.5 text-sm font-bold rounded-full items-center gap-2 border shadow-sm ${badgeBg}`}>
                                    {isBusiness ? <Briefcase className="w-4 h-4" /> : isPro ? <Sparkles className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                                    {isBusiness ? 'Business Plan' : isPro ? 'Pro Plan' : 'Free Plan'}
                                </div>
                                <div className={`inline-flex px-4 py-1.5 text-sm font-medium rounded-full items-center gap-2 border ${!isFree ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    <Clock className="w-4 h-4" />
                                    Member since {memberSince}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleLogout}
                                className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm ${!isFree ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview (Floating) */}
            <div className="container mx-auto px-4 -mt-16 relative z-20 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Files Stat */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${isBusiness ? 'bg-purple-50 text-purple-600' : isPro ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                            <FileCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Files</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalFiles}</h3>
                        </div>
                    </div>

                    {/* Storage Stat */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${isBusiness ? 'bg-purple-50 text-purple-600' : isPro ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                            <HardDrive className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">Storage Used</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalSizeFormatted}</h3>
                        </div>
                    </div>

                    {/* Quick Upgrade / Plan Stat */}
                    <Link href="/pricing" className={`bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-${themeColor}-200 transition-all`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${isBusiness ? 'bg-purple-50 text-purple-600' : isPro ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">Current Plan</p>
                                <h3 className={`text-2xl font-bold ${isBusiness ? 'text-purple-600' : isPro ? 'text-amber-600' : 'text-gray-900'}`}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h3>
                            </div>
                        </div>
                        {isFree && (
                            <span className="text-rose-600 font-bold text-sm bg-rose-50 px-3 py-1 rounded-full group-hover:bg-rose-600 group-hover:text-white transition-all">Upgrade &rarr;</span>
                        )}
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className={`w-5 h-5 ${isBusiness ? 'text-purple-500' : isPro ? 'text-amber-500' : 'text-rose-500'}`} />
                                    Recent Activity
                                </h2>
                            </div>

                            <div className="">
                                {loadingFiles ? (
                                    <div className="h-40 flex items-center justify-center text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current opacity-50"></div>
                                    </div>
                                ) : recentFiles.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="mb-4">No files processed yet.</p>
                                        <Link href="/" className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-bold shadow-lg transition-all inline-block">
                                            Start Converting
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {recentFiles.map((file) => (
                                            <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isBusiness ? 'bg-purple-50 text-purple-600' : isPro ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] md:max-w-md group-hover:text-rose-600 transition-colors">{file.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{file.name.split('.').pop()?.toUpperCase()}</span>
                                                            {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a href={file.url} download target="_blank" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <button onClick={() => handleDelete(file.id, file.url)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Account Info</h3>

                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Email Address</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden w-full">
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">User ID</p>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 truncate flex-1 block">
                                                {user.id}
                                            </code>
                                            <button onClick={() => navigator.clipboard.writeText(user.id)} className="text-gray-400 hover:text-gray-900">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isFree && (
                            <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-rose-200">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

                                <Sparkles className="w-8 h-8 text-yellow-300 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Go Professional</h3>
                                <p className="text-white/90 mb-6 text-sm leading-relaxed">
                                    Get unlimited file sizes, priority support, and ad-free experience.
                                </p>

                                <Link href="/pricing" className="block w-full py-3 bg-white text-rose-600 text-center font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-lg">
                                    Upgrade Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
