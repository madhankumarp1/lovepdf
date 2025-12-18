"use client";

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { Scissors, Trash2, ArrowRight } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function SplitClient() {
    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelected = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleSplit = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);
            const totalPages = pdfDoc.getPageCount();

            // Parse range (e.g., "1-3, 5")
            const pagesToExtract = new Set<number>();

            if (!range) {
                // If no range, split all pages into separate files
                for (let i = 0; i < totalPages; i++) {
                    const newPdf = await PDFDocument.create();
                    const [page] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(page);
                    const pdfBytes = await newPdf.save();
                    downloadPdf(pdfBytes, `split_${i + 1}_${file.name}`);
                }
            } else {
                // Parse custom range
                const parts = range.split(',').map(p => p.trim());
                for (const part of parts) {
                    if (part.includes('-')) {
                        const [start, end] = part.split('-').map(n => parseInt(n));
                        if (!isNaN(start) && !isNaN(end)) {
                            for (let i = start; i <= end; i++) {
                                if (i >= 1 && i <= totalPages) pagesToExtract.add(i - 1);
                            }
                        }
                    } else {
                        const pageNum = parseInt(part);
                        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                            pagesToExtract.add(pageNum - 1);
                        }
                    }
                }

                if (pagesToExtract.size > 0) {
                    const newPdf = await PDFDocument.create();
                    const pageIndices = Array.from(pagesToExtract).sort((a, b) => a - b);
                    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
                    copiedPages.forEach(page => newPdf.addPage(page));
                    const pdfBytes = await newPdf.save();
                    downloadPdf(pdfBytes, `split_selected_${file.name}`);
                }
            }

        } catch (error) {
            console.error("Split failed", error);
            alert("Failed to split PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadPdf = (bytes: Uint8Array, fileName: string) => {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
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
                        onFilesSelected={handleFileSelected}
                        accept=".pdf"
                        description="or drop PDF here"
                    />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-rose-100 p-2 rounded-lg">
                                        <Scissors className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <span className="font-medium truncate max-w-[200px]" title={file.name}>{file.name}</span>
                                </div>
                                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-rose-500">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Range (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 1-5, 8, 11-13"
                                        value={range}
                                        onChange={(e) => setRange(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to extract all pages separately</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/3 w-full sticky top-24">
                            <button
                                onClick={handleSplit}
                                disabled={isProcessing}
                                className="w-full bg-rose-600 text-white py-4 rounded-xl text-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? 'Splitting PDF...' : (
                                    <>Split PDF <ArrowRight className="w-6 h-6" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
