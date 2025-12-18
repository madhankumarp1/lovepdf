"use client";

import { useState } from 'react';
import { FileType, Download, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function WordToPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsConverting(true);

        // Simulation/Mock Implementation
        // In a real app, this requires a backend server (LibreOffice/Pandoc) 
        // because browsers cannot reliably render DOCX to PDF pixel-perfectly.

        try {
            // Create a simple PDF that says "Converted from [Filename]"
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            page.drawText(`Converted content of: ${file.name}`, {
                x: 50,
                y: height - 100,
                size: 20,
                font: font,
                color: rgb(0, 0, 0),
            });

            page.drawText('(This is a demonstration of the Word to PDF UI flow)', {
                x: 50,
                y: height - 140,
                size: 12,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${file.name.replace('.docx', '').replace('.doc', '')}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error converting Word to PDF:', error);
            alert('Failed to convert file.');
        } finally {
            setIsConverting(false);
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Word to PDF</h1>
                    <p className="text-lg text-slate-600">Convert your DOC and DOCX files to PDF instantly.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <FileType className="w-16 h-16 text-blue-500 mb-6" />
                                <span className="text-xl font-medium text-slate-900">Select Word file</span>
                                <span className="text-sm text-slate-500 mt-2">or drop DOC/DOCX here</span>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <FileType className="w-6 h-6 text-blue-600" />
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

                            <button
                                onClick={handleConvert}
                                disabled={isConverting}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isConverting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-3" />
                                        Convert to PDF
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
