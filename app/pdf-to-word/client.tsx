"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { Download, FileType } from 'lucide-react';

export default function PdfToWordClient() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', files[0]);

            const response = await fetch('/api/pdf-to-word', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Conversion failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${files[0].name.replace('.pdf', '')}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error('Error converting PDF:', error);
            alert('Failed to convert PDF. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to Word Converter</h1>
                <p className="text-lg text-gray-600">Easily convert your PDF files into easy to edit DOC and DOCX documents.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <FileUploader
                    onFilesSelected={(newFiles) => setFiles(newFiles)}
                    accept=".pdf"
                />

                {files.length > 0 && (
                    <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl mb-6 w-full max-w-md">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <FileType className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{files[0].name}</p>
                                <p className="text-sm text-gray-500">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => setFiles([])}
                                className="text-gray-400 hover:text-red-500 p-2"
                            >
                                Remove
                            </button>
                        </div>

                        <button
                            onClick={handleConvert}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 min-w-[200px]"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                <>
                                    Convert to Word
                                    <Download className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
