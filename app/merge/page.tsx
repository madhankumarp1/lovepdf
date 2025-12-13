"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { FileText, Trash2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function MergePage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (newFiles: File[]) => {
        // Append new files to existing ones
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            alert("Please select at least 2 PDF files to merge.");
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await api.post('/merge', formData, {
                responseType: 'blob', // Important for file download
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'merged_love_pdf.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Merge failed", error);
            alert("Failed to merge PDFs. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Merge PDF files</h1>
                <p className="text-xl text-gray-600">Combine PDFs in the order you want with the easiest PDF merger available.</p>
            </div>

            {files.length === 0 ? (
                <div className="max-w-xl mx-auto">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        multiple={true}
                        description="or drop PDFs here"
                    />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                            {files.map((file, i) => (
                                <div key={i} className="relative group bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={() => removeFile(i)} className="bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 py-4">
                                        <FileText className="w-12 h-12 text-rose-500" />
                                        <span className="text-sm font-medium text-center truncate w-full px-2" title={file.name}>{file.name}</span>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl min-h-[160px] bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => document.getElementById('add-more-input')?.click()}>
                                <div className="text-center">
                                    <span className="text-rose-600 font-bold text-lg">+</span>
                                    <p className="text-sm text-gray-500">Add more files</p>
                                    <input id="add-more-input" type="file" multiple className="hidden" accept=".pdf" onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))} />
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/3 w-full sticky top-24">
                            <button
                                onClick={handleMerge}
                                disabled={isProcessing || files.length < 2}
                                className="w-full bg-rose-600 text-white py-4 rounded-xl text-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? 'Merging PDF...' : (
                                    <>Merge PDF <ArrowRight className="w-6 h-6" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
