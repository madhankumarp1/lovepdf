import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
        const buffer = Buffer.from(pdfBytes);

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
                                // The `setAll` method was called from a Server Component.
                                // This can be ignored if you have middleware refreshing user sessions.
                            }
                        },
                    },
                }
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const fileName = `merged_${Date.now()}.pdf`;
                const filePath = `${user.id}/${fileName}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('user-files')
                    .upload(filePath, buffer, {
                        contentType: 'application/pdf',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Supabase Storage Upload Error:", uploadError);
                } else {
                    // 2. Insert into DB
                    const { data: publicUrlData } = supabase.storage
                        .from('user-files')
                        .getPublicUrl(filePath);

                    const { error: dbError } = await supabase
                        .from('files')
                        .insert({
                            user_id: user.id,
                            name: fileName,
                            url: publicUrlData.publicUrl,
                            size: buffer.length,
                            type: 'application/pdf'
                        });

                    if (dbError) {
                        console.error("Supabase DB Insert Error:", dbError);
                    }
                }
            }
        } catch (authError) {
            console.error("Auth/Save Error (Non-blocking):", authError);
            // Continue to return the file even if saving fails
        }
        // ---------------------------------------------

        // Return as PDF stream
        return new NextResponse(buffer, {
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
