"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { Download, FileImage } from 'lucide-react';

export default function PdfToJpgClient() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        try {
            // Lazy load pdfjs-dist to avoid SSR ReferenceError (DOMMatrix)
            const pdfjsLib = await import('pdfjs-dist');

            // Initialize worker
            // Note: We need to cast window to any or ignore TS error for workerSrc if types mismatch, 
            // generally pdfjs-dist types handle this but versioning is tricky.
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const file = files[0];
            const fileBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(fileBuffer).promise;

            // Convert Page 1
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${file.name.replace('.pdf', '')}_page1.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                }, 'image/jpeg', 0.95);
            }

        } catch (error) {
            console.error('Error converting PDF to JPG:', error);
            alert('Failed to convert PDF. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to JPG Converter</h1>
                <p className="text-lg text-gray-600">Extract images from your PDF or save each page as a separate image.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <FileUploader
                    onFilesSelected={(newFiles) => setFiles(newFiles)}
                    accept=".pdf"
                />

                {files.length > 0 && (
                    <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl mb-6 w-full max-w-md">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                <FileImage className="w-6 h-6" />
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
                            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 min-w-[200px]"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                <>
                                    Convert to JPG
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
