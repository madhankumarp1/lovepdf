"use client";

import { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Upload, Stamp, Download, X, ArrowLeft, Type } from 'lucide-react';
import Link from 'next/link';

export default function WatermarkPdfClient() {
    const [file, setFile] = useState<File | null>(null);
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [opacity, setOpacity] = useState(0.5);
    const [size, setSize] = useState(50);
    const [rotation, setRotation] = useState(45);
    const [color, setColor] = useState('#FF0000'); // Hex color
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    };

    const handleWatermark = async () => {
        if (!file || !watermarkText) return;
        setIsProcessing(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const pages = pdfDoc.getPages();
            const { r, g, b } = hexToRgb(color);

            pages.forEach((page) => {
                const { width, height } = page.getSize();
                const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, size);
                const textHeight = helveticaFont.heightAtSize(size);

                page.drawText(watermarkText, {
                    x: width / 2 - textWidth / 2, // Centered (approximate for rotation)
                    y: height / 2 - textHeight / 2,
                    size: size,
                    font: helveticaFont,
                    color: rgb(r, g, b),
                    opacity: opacity,
                    rotate: degrees(rotation),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `watermarked-${file.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error adding watermark:', error);
            alert('Failed to add watermark.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Tools
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Watermark PDF</h1>
                    <p className="text-lg text-slate-600">Stamp text over your PDF files instantly.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 grid md:grid-cols-2 gap-8">
                    {/* Left Col: Upload/Preview Placeholder */}
                    <div className="space-y-6">
                        {!file ? (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors bg-slate-50/50 h-full flex flex-col justify-center items-center">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    <Stamp className="w-16 h-16 text-blue-500 mb-6" />
                                    <span className="text-xl font-medium text-slate-900">Select PDF file</span>
                                    <span className="text-sm text-slate-500 mt-2">or drop PDF here</span>
                                </label>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center h-full relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                    <p style={{
                                        fontSize: `${size}px`,
                                        color: color,
                                        transform: `rotate(${rotation}deg)`,
                                        fontWeight: 'bold',
                                        opacity: opacity
                                    }}>
                                        {watermarkText || 'WATERMARK'}
                                    </p>
                                </div>
                                <Stamp className="w-16 h-16 text-slate-400 mb-4" />
                                <p className="font-medium text-slate-900 text-center mb-1">{file.name}</p>
                                <p className="text-sm text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Replace File
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Controls */}
                    <div className="space-y-6 md:pl-6 md:border-l border-slate-100">
                        <h3 className="font-semibold text-slate-900 flex items-center">
                            <Type className="w-5 h-5 mr-2 text-blue-500" />
                            Watermark Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Text</label>
                                <input
                                    type="text"
                                    value={watermarkText}
                                    onChange={(e) => setWatermarkText(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. DRAFT"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Font Size</label>
                                    <input
                                        type="number"
                                        value={size}
                                        onChange={(e) => setSize(Number(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                        min="8"
                                        max="200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rotation (deg)</label>
                                    <input
                                        type="number"
                                        value={rotation}
                                        onChange={(e) => setRotation(Number(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="h-10 w-full rounded border border-slate-300 cursor-pointer p-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Opacity</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                        className="w-full mt-3 accent-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleWatermark}
                                disabled={isProcessing || !file || !watermarkText}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Stamping PDF...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 mr-3" />
                                        Download Watermarked PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
