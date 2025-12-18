"use client";

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Unlock, Download, X, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnlockPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [needsPassword, setNeedsPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setNeedsPassword(false);
            setPassword('');
            setErrorMessage('');
        }
    };

    const handleUnlock = async () => {
        if (!file) return;
        setIsProcessing(true);
        setErrorMessage('');

        try {
            const fileArrayBuffer = await file.arrayBuffer();

            // Try loading with the provided password (or empty if none yet)
            // Note: If the file is not encrypted, this will just load it.
            // If it IS encrypted, it will throw an error if password is wrong/missing.

            try {
                const pdfDoc = await PDFDocument.load(fileArrayBuffer, {
                    password: password || undefined,
                    ignoreEncryption: false
                });

                // If loaded successfully, save it -> this removes encryption
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `unlocked-${file.name}`;
                link.click();
                URL.revokeObjectURL(url);
                setNeedsPassword(false);

            } catch (loadError: any) {
                // Check if error implies password required
                if (loadError.message && (loadError.message.includes('password') || loadError.message.includes('encrypted'))) {
                    setNeedsPassword(true);
                    if (password) {
                        setErrorMessage('Incorrect password. Please try again.');
                    } else {
                        // First attempt without password, just show input
                    }
                } else {
                    throw loadError;
                }
            }

        } catch (error) {
            console.error('Error unlocking PDF:', error);
            setErrorMessage('Failed to unlock PDF. The file might be corrupted.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Tools
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Unlock PDF</h1>
                    <p className="text-lg text-slate-600">Remove password security from your PDF files instantly.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <Unlock className="w-16 h-16 text-blue-500 mb-6" />
                                <span className="text-xl font-medium text-slate-900">Select PDF file</span>
                                <span className="text-sm text-slate-500 mt-2">or drop PDF here</span>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                                        <Unlock className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{file.name}</p>
                                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {needsPassword && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                                    <div className="flex items-center mb-4 text-orange-800">
                                        <Lock className="w-5 h-5 mr-2" />
                                        <span className="font-medium">This document is protected</span>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter document password"
                                            className="w-full px-4 py-3 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all pr-12"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errorMessage && (
                                        <p className="flex items-center text-sm text-red-600 mt-2">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleUnlock}
                                disabled={isProcessing || (needsPassword && !password)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Unlocking...
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="w-5 h-5 mr-3" />
                                        {needsPassword ? 'Unlock PDF' : 'Remove Security'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
