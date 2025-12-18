"use client";

import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Upload, RotateCw, Download, X, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function RotatePdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [pageRotations, setPageRotations] = useState<number[]>([]);
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            await generateThumbnails(selectedFile);
        }
    };

    const generateThumbnails = async (pdfFile: File) => {
        setIsLoadingPreviews(true);
        setThumbnails([]);
        setPageRotations([]);

        try {
            // Lazy load pdfjs-dist to avoid SSR ReferenceError
            const pdfjsLib = await import('pdfjs-dist');
            // @ts-ignore
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

            const newThumbnails: string[] = [];
            const newRotations: number[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);

                // Calculate scale to fit in a reasonable thumbnail size (e.g., width 200px)
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    newThumbnails.push(canvas.toDataURL());
                    newRotations.push(0); // Initial rotation is 0
                }
            }

            setThumbnails(newThumbnails);
            setPageRotations(newRotations);

        } catch (error) {
            console.error('Error generating thumbnails:', error);
            alert('Failed to load PDF previews. Please try again.');
        } finally {
            setIsLoadingPreviews(false);
        }
    };

    const rotatePage = (index: number) => {
        const newRotations = [...pageRotations];
        newRotations[index] = (newRotations[index] + 90) % 360;
        setPageRotations(newRotations);
    };

    const rotateAll = () => {
        const newRotations = pageRotations.map(r => (r + 90) % 360);
        setPageRotations(newRotations);
    };

    const handleSave = async () => {
        if (!file) return;
        setIsConverting(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            pages.forEach((page, index) => {
                const rotationToAdd = pageRotations[index] || 0;

                // Only modify if there is a rotation change
                if (rotationToAdd !== 0) {
                    const currentRotation = page.getRotation().angle;
                    const newRotationAngle = (currentRotation + rotationToAdd) % 360;
                    page.setRotation(degrees(newRotationAngle));
                }
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `rotated-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error saving PDF:', error);
            alert('Failed to save rotated PDF. Please try a different file.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Tools
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Rotate PDF</h1>
                    <p className="text-lg text-slate-600">Rotate your PDF pages individually or all at once.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {!file ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <RefreshCw className="w-16 h-16 text-blue-500 mb-6" />
                                <span className="text-xl font-medium text-slate-900">Select PDF file</span>
                                <span className="text-sm text-slate-500 mt-2">or drop PDF here</span>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 sticky top-0 z-10">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <RefreshCw className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{file.name}</p>
                                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • {thumbnails.length} Pages</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={rotateAll}
                                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        Rotate All
                                    </button>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            {isLoadingPreviews ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-slate-600">Generating previews...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {thumbnails.map((src, index) => (
                                        <div key={index} className="flex flex-col items-center group">
                                            <div className="relative mb-3 transition-transform duration-300" style={{ transform: `rotate(${pageRotations[index]}deg)` }}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={src}
                                                    alt={`Page ${index + 1}`}
                                                    className="rounded shadow-md border border-slate-200 max-w-full h-auto"
                                                />
                                                <div className="absolute inset-0 bg-black/ opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded cursor-pointer" onClick={() => rotatePage(index)}>
                                                    <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg transform active:rotate-90 transition-transform">
                                                        <RotateCw className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-slate-500">Page {index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={isConverting || isLoadingPreviews}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 sticky bottom-4"
                            >
                                {isConverting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Saving PDF...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-3" />
                                        Download Rotated PDF
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
