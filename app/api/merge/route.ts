import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (files.length < 2) {
            return NextResponse.json({ error: "At least 2 files are required" }, { status: 400 });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        const pdfBytes = await mergedPdf.save();

        // Return as PDF stream
        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="merged_love_pdf.pdf"',
            },
        });

    } catch (error) {
        console.error("Merge API Error:", error);
        return NextResponse.json({ error: "Failed to merge PDFs" }, { status: 500 });
    }
}
