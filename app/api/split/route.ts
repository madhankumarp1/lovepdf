import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import AdmZip from 'adm-zip';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numberOfPages = pdfDoc.getPageCount();

        const zip = new AdmZip();
        const baseName = file.name.replace('.pdf', '');

        for (let i = 0; i < numberOfPages; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();

            // Add to zip buffer
            zip.addFile(`${baseName}_page_${i + 1}.pdf`, Buffer.from(pdfBytes));
        }

        const zipBuffer = zip.toBuffer();

        return new NextResponse(Buffer.from(zipBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${baseName}_split.zip"`,
            },
        });

    } catch (error) {
        console.error("Split API Error:", error);
        return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 });
    }
}
