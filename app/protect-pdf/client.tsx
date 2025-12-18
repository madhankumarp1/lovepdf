"use client";

import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Upload, Lock, Download, X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ProtectPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleProtect = async () => {
        if (!file || !password) return;
        setIsProcessing(true);

        try {
            const fileArrayBuffer = await file.arrayBuffer();

            // Attempt to load. If it forces password, it's already encrypted.
            // We load with ignoreEncryption to see if we can read it, but usually standard PDF loaders fail 
            // if encrypted without password. simpler is to try-catch the load.
            let pdfDoc;
            try {
                pdfDoc = await PDFDocument.load(fileArrayBuffer);
            } catch (e: any) {
                if (e.message && (e.message.includes('encrypt') || e.message.includes('Password'))) {
                    alert("This file is ALREADY encrypted. Please Unlock it first.");
                    setIsProcessing(false);
                    return;
                }
                throw e;
            }

            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: password, // Same password for simplicity
                permissions: {
                    printing: 'highResolution',
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false,
                },
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `protected-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error protecting PDF:', error);
            alert('Failed to protect PDF. Please ensure the file is a valid, unprotected PDF.');
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Protect PDF</h1>
                    <p className="text-lg text-slate-600">Encrypt your PDF with a password to keep sensitive data confidential.</p>
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
                                <Lock className="w-16 h-16 text-blue-500 mb-6" />
                                <span className="text-xl font-medium text-slate-900">Select PDF file</span>
                                <span className="text-sm text-slate-500 mt-2">or drop PDF here</span>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center">
                                    <div className="bg-red-100 p-2 rounded-lg mr-4">
                                        <Lock className="w-6 h-6 text-red-600" />
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

                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Set a Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter strong password"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleProtect}
                                disabled={isProcessing || !password}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Encrypting PDF...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5 mr-3" />
                                        Protect PDF
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
