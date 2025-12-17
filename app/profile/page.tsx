"use client";

import { useUser } from '@/lib/useUser';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, LogOut, Upload, User as UserIcon, Settings, CreditCard, Clock, Shield, Sparkles, Mail, Calendar, Copy } from 'lucide-react';
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
                .limit(10);

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

    // Format date
    const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    const isPro = profile?.tier === 'pro' || profile?.tier === 'business';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 overflow-x-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none z-0"></div>

            <div className="container mx-auto px-4 pt-8 md:pt-12 relative z-10 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
                            {user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500">{user.email}</p>
                            <div className={`mt-2 inline-flex px-3 py-1 text-xs font-bold rounded-full items-center gap-1.5 border ${isPro ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                                <Sparkles className="w-3 h-3" />
                                {isPro ? 'Pro Account' : 'Free Account'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="self-start md:self-center px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Account Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                        <p className="text-xs text-green-600 font-medium">Verified</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900">Member Since</p>
                                        <p className="text-xs text-gray-500">{memberSince}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-gray-100 text-gray-600 rounded-xl">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900">User ID</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-mono text-gray-500 truncate bg-gray-50 p-1.5 rounded mt-0.5 max-w-[140px] select-all">
                                                {user.id}
                                            </p>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(user.id)}
                                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                title="Copy ID"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isPro && (
                            <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <CreditCard className="w-8 h-8 opacity-80" />
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">Free Plan</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Upgrade to Pro</h3>
                                    <p className="text-rose-100 text-sm mb-6">Unlock unlimited PDF tools and higher file limits.</p>
                                    <Link href="/pricing" className="block w-full py-2.5 bg-white text-rose-600 text-center font-bold rounded-lg hover:bg-rose-50 transition-colors shadow-sm">
                                        View Plans
                                    </Link>
                                </div>
                            </div>
                        )}

                        {isPro && (
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <Sparkles className="w-8 h-8 text-amber-400" />
                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold backdrop-blur-sm border border-amber-500/20">Pro Active</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Pro Account</h3>
                                    <p className="text-gray-400 text-sm mb-6">You have access to all premium features.</p>
                                    <div className="w-full py-2.5 bg-gray-800 text-gray-400 text-center font-bold rounded-lg border border-gray-700">
                                        Manage Subscription
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Recent Files */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-rose-500" />
                                    Recent Files
                                </h2>
                                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Last 10 files</span>
                            </div>

                            <div className="">
                                {loadingFiles ? (
                                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
                                            Loading files...
                                        </div>
                                    </div>
                                ) : errorMsg ? (
                                    <div className="p-8 text-center">
                                        <div className="bg-red-50 text-red-600 p-4 rounded-xl inline-block mb-3 text-sm max-w-md">
                                            <strong>Error:</strong> {errorMsg}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Please ensuring you have run the database migration (SQL) in Supabase.
                                        </p>
                                    </div>
                                ) : recentFiles.length === 0 ? (
                                    <div className="h-60 flex flex-col items-center justify-center text-gray-400 text-sm gap-3">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                                            <FileText className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p>No processed files yet.</p>
                                        <Link href="/" className="px-5 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm font-bold shadow-md shadow-rose-200 transition-all">
                                            Try a tool
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {recentFiles.map((file) => (
                                            <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors group">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs transition-colors group-hover:text-rose-600" title={file.name}>
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={file.url}
                                                        download={file.name}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(file.id, file.url)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Delete"
                                                    >
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
                </div>
            </div>
        </div>
    );
}
