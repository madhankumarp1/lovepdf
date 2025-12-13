"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { Download, Minimize2 } from 'lucide-react';


export default function CompressPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleCompress = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', files[0]);

            // TODO: Implement actual backend compression endpoint
            // For now, we simulate a delay and just return the same file to demonstrate UI
            // const response = await api.post('/compress', formData, { responseType: 'blob' });

            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = { data: files[0] }; // Mock response

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `compressed_${files[0].name}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error compressing PDF:', error);
            alert('Failed to compress PDF. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Compress PDF file</h1>
                <p className="text-lg text-gray-600">Reduce file size while optimizing for maximal PDF quality.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <FileUploader
                    onFilesSelected={(newFiles) => setFiles(newFiles)}

                    accept=".pdf"
                />

                {files.length > 0 && (
                    <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl mb-6 w-full max-w-md">
                            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                                <Minimize2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{files[0].name}</p>
                                <p className="text-sm text-gray-500">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => setFiles([])}
                                className="text-gray-400 hover:text-red-500 p-2"
                            >
                                Example Remove
                            </button>
                        </div>

                        <button
                            onClick={handleCompress}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-200 min-w-[200px]"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Compressing...
                                </>
                            ) : (
                                <>
                                    Compress PDF
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
