"use client";

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileImage, Download, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JpgToPdfClient() {
    const [files, setFiles] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsConverting(true);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const imageBytes = await file.arrayBuffer();
                let image;

                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    // Skip unsupported formats or handle them
                    continue;
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'docmorph-converted.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error converting images to PDF:', error);
            alert('Failed to convert images. Please ensure they are valid JPG or PNG files.');
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">JPG to PDF Converter</h1>
                    <p className="text-lg text-slate-600">Convert your images to a single PDF file instantly.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-12 h-12 text-blue-500 mb-4" />
                            <span className="text-lg font-medium text-slate-900">Click to upload images</span>
                            <span className="text-sm text-slate-500 mt-2">JPG, PNG supported</span>
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <h3 className="font-medium text-slate-900">Selected Images ({files.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group bg-slate-100 rounded-lg p-2 flex flex-col items-center justify-center">
                                        <div className="w-full h-24 relative mb-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full h-full object-contain rounded"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600 truncate w-full text-center">{file.name}</p>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleConvert}
                                disabled={isConverting}
                                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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
