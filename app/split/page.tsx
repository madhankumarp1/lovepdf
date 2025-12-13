"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ArrowRight, FileText } from 'lucide-react';
import api from '@/lib/api';

export default function SplitPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleSplit = async () => {
        if (!file) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/split', formData, {
                responseType: 'blob',
            });

            // Depending on backend, this might be a zip or a list of files. 
            // For MVP assume it might be a Zip if multiple, or just handle single for now?
            // Actually backend split logic returned a list of paths, but how to return via API? 
            // Usually we zip them. I need to update backend to zip.
            // For now, let's assume zipping.

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'split_files.zip'); // Assuming zip
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Split failed", error);
            alert("Split functionality pending backend update to Zip response.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Split PDF file</h1>
                <p className="text-xl text-gray-600">Separate one page or a whole set for easy conversion into independent PDF files.</p>
            </div>

            {!file ? (
                <div className="max-w-xl mx-auto">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        multiple={false}
                        description="or drop PDF here"
                    />
                </div>
            ) : (
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col items-center">
                        <FileText className="w-16 h-16 text-rose-500 mb-4" />
                        <p className="font-medium text-lg">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button onClick={() => setFile(null)} className="mt-4 text-xs text-rose-600 hover:underline">Remove</button>
                    </div>

                    <button
                        onClick={handleSplit}
                        disabled={isProcessing}
                        className="bg-rose-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? 'Splitting PDF...' : (
                            <>Split PDF <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
