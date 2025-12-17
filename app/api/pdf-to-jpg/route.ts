import { NextRequest, NextResponse } from 'next/server';
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

        // Mock Conversion: Create a zip with a dummy image (text file)
        const zip = new AdmZip();
        // Just adding a text file pretending to be an image listing
        zip.addFile("images/info.txt", Buffer.from(`This is a simulated image extraction for ${file.name}. Backend integration required for real image processing.`));

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
                const fileName = `images_${Date.now()}.zip`;
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
                'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '')}_images.zip"`,
            },
        });

    } catch (error) {
        console.error("PDF-to-JPG API Error:", error);
        return NextResponse.json({ error: "Failed to convert PDF" }, { status: 500 });
    }
}
