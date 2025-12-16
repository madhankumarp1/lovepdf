"use client";

import { useState } from 'react';
import { X, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!supabase) {
            setError("System configuration error.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Force production URL to avoid localhost fallback
                emailRedirectTo: 'https://docmorph.online',
            },
        });

        if (error) {
            setError(error.message);
            setSent(false);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 mt-2 text-sm">Enter your email to access your account</p>
                    </div>

                    {sent ? (
                        <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email!</h3>
                            <p className="text-gray-600 mb-6">
                                We've sent a magic link to <span className="font-semibold text-gray-900">{email}</span>. <br />
                                Click the link to sign in.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                            >
                                {loading ? 'Sending...' : 'Send Magic Link'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>
                    )}
                </div>

                {!sent && (
                    <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t">
                        By logging in, you agree to our Terms of Service using Secure Passwordless Auth
                    </div>
                )}
            </div>
        </div>
    );
}
