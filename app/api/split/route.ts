import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import AdmZip from 'adm-zip';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
        const buffer = Buffer.from(zipBuffer);

        // --- Save to Supabase if User is Logged In ---
        try {
            const cookieStore = await cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return cookieStore.getAll();
                        },
                        setAll(cookiesToSet) {
                            try {
                                cookiesToSet.forEach(({ name, value, options }) =>
                                    cookieStore.set(name, value, options)
                                );
                            } catch {
                                // Ignore server component cookie set error
                            }
                        },
                    },
                }
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const fileName = `split_${Date.now()}.zip`;
                const filePath = `${user.id}/${fileName}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('user-files')
                    .upload(filePath, buffer, {
                        contentType: 'application/zip',
                        upsert: false
                    });

                if (!uploadError) {
                    // 2. Insert into DB
                    const { data: publicUrlData } = supabase.storage
                        .from('user-files')
                        .getPublicUrl(filePath);

                    await supabase
                        .from('files')
                        .insert({
                            user_id: user.id,
                            name: fileName,
                            url: publicUrlData.publicUrl,
                            size: buffer.length,
                            type: 'application/zip'
                        });
                }
            }
        } catch (authError) {
            console.error("Auth/Save Error:", authError);
        }
        // ---------------------------------------------

        return new NextResponse(buffer, {
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
