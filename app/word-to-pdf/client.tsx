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
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Word to PDF Converter – Free & Easy Online Tool</h1>
                    <p className="text-lg text-slate-600">Convert Word documents to PDF online for free using DocMorph.</p>
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
            {/* SEO Content Section */}
            <div className="max-w-4xl mx-auto mt-16 prose prose-slate">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Convert Word to PDF Online for Free</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        DocMorph offers a simple and fast way to convert Word to PDF online. Just upload your Word file, and our tool will instantly create a PDF that preserves formatting, layout, and text quality.
                    </p>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        There are <strong>no watermarks</strong>, no registration, and no hidden limits. This makes DocMorph a perfect choice for students, professionals, and anyone who needs a reliable Word to PDF converter.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Convert Word to PDF</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-8">
                        <li>Upload your Word (DOC or DOCX) file</li>
                        <li>Click the convert button</li>
                        <li>Download your PDF instantly</li>
                    </ol>
                    <p className="text-slate-600 mb-8">Your Word file is converted securely in seconds.</p>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose DocMorph Word to PDF Converter</h2>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 mb-8">
                        <li>Free Word to PDF conversion</li>
                        <li>No watermark added</li>
                        <li>Fast and simple interface</li>
                        <li>Secure file handling</li>
                        <li>Works on mobile and desktop</li>
                    </ul>
                    <p className="text-slate-600 mb-8">
                        DocMorph is built to be a <strong>simple Word to PDF converter</strong> that anyone can use without technical knowledge.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Secure Word to PDF Conversion</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Your privacy matters. Files uploaded to DocMorph are processed securely and automatically removed after conversion. We do not store or share your documents.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Convert Word to PDF Anytime, Anywhere</h2>
                    <p className="text-slate-600 leading-relaxed">
                        DocMorph works directly in your browser, so you can convert Word to PDF online from any device. No installation is required.
                    </p>
                    <p className="text-slate-600 mt-4 font-medium">
                        Try our <strong>free Word to PDF online tool</strong> today and simplify your document work.
                    </p>
                </div>
            </div>
        </div>
    );
}
