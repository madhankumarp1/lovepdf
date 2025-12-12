"use client";

import { useState, useCallback, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
    description?: string;
}

export function FileUploader({ onFilesSelected, multiple = false, accept = ".pdf", description = "or drop PDFs here" }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            // Filter if needed based on accept prop logic (simple extension check)
            onFilesSelected(files);
            e.dataTransfer.clearData();
        }
    }, [onFilesSelected]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFilesSelected(Array.from(e.target.files));
        }
    };

    return (
        <div
            className={cn(
                "relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all text-center p-12 hover:bg-rose-50/50 hover:border-rose-300",
                isDragging && "bg-rose-50 border-rose-500 scale-[1.01]"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                className="hidden"
                onChange={handleFileInput}
                ref={fileInputRef}
            />

            <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-rose-600 p-4 rounded-full shadow-lg shadow-rose-200">
                    <UploadCloud className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-rose-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-700 transition-all shadow-md hover:shadow-lg"
                    >
                        Select PDF files
                    </button>
                    <p className="text-gray-500 font-medium">{description}</p>
                </div>
            </div>
        </div>
    );
}
