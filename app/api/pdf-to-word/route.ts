import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        // Mock Conversion: Create a dummy text file pretending to be DOCX
        const mockContent = `This is a simulated converted document for ${file.name}.\n\nIn a real application, a conversion engine would process the PDF content here.`;
        const buffer = Buffer.from(mockContent);

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
                const fileName = `converted_${Date.now()}.docx`;
                const filePath = `${user.id}/${fileName}`;

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('user-files')
                    .upload(filePath, buffer, {
                        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
                            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '')}.docx"`,
            },
        });

    } catch (error) {
        console.error("PDF-to-Word API Error:", error);
        return NextResponse.json({ error: "Failed to convert PDF" }, { status: 500 });
    }
}
