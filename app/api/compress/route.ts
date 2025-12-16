import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Basic optimization: re-saving with pdf-lib often reduces size for unoptimized PDFs
        // We can also clear metadata to save a few bytes
        pdfDoc.setTitle(file.name.replace('.pdf', ''));
        pdfDoc.setProducer('DocMorph (docmorph.online)');
        pdfDoc.setCreator('DocMorph');

        // usage of useObjectStreams: false might increase size, so we rely on default or explicit true?
        // Actually pdf-lib creates object streams by default.
        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="compressed_${file.name}"`,
            },
        });

    } catch (error) {
        console.error("Compress API Error:", error);
        return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 });
    }
}
