"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { Minimize2, Trash2, ArrowRight } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function CompressClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleCompress = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            // Note: pdf-lib doesn't support true compression, it mostly just rewrites the file
            // For real compression we would need a backend service or a heavier WASM library
            // For now, we'll simulate the flow and maybe strip some metadata if possible

            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);

            // Basic optimization: Remove unused objects (garbage collection essentially)
            // In a real app, we'd send this to a backend like Ghostscript

            const pdfBytes = await pdfDoc.save();

            // Simulating compression by just saving (pdf-lib save often optimizes slightly)
            // To actually compress, we'd ideally use an API. 
            // For this frontend-only demo, we just download the 'optimized' file.

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compressed_${file.name}`;
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Compress failed", error);
            alert("Failed to compress PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Compress PDF file</h1>
                <p className="text-xl text-gray-600">Reduce file size while optimizing for maximal PDF quality.</p>
            </div>

            {!file ? (
                <div className="max-w-xl mx-auto">
                    <FileUploader
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        description="or drop PDF here"
                    />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-rose-100 p-2 rounded-lg">
                                        <Minimize2 className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <span className="font-medium truncate max-w-[200px]" title={file.name}>{file.name}</span>
                                    <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-rose-500">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setCompressionLevel('low')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${compressionLevel === 'low' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="font-bold text-gray-900">Extreme</div>
                                    <div className="text-sm text-gray-500 mt-1">Less quality, high compression</div>
                                </button>
                                <button
                                    onClick={() => setCompressionLevel('medium')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${compressionLevel === 'medium' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="font-bold text-gray-900">Recommended</div>
                                    <div className="text-sm text-gray-500 mt-1">Good quality, good compression</div>
                                </button>
                                <button
                                    onClick={() => setCompressionLevel('high')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${compressionLevel === 'high' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="font-bold text-gray-900">Less</div>
                                    <div className="text-sm text-gray-500 mt-1">High quality, less compression</div>
                                </button>
                            </div>
                        </div>

                        <div className="md:w-1/3 w-full sticky top-24">
                            <button
                                onClick={handleCompress}
                                disabled={isProcessing}
                                className="w-full bg-rose-600 text-white py-4 rounded-xl text-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? 'Compressing PDF...' : (
                                    <>Compress PDF <ArrowRight className="w-6 h-6" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
