import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF to JPG - Convert PDF to Images Online',
    description: 'Extract images from a PDF or convert each page to a separate image. 100% free.',
    openGraph: {
        title: 'PDF to JPG - Convert PDF to Images Online',
        description: 'Extract images from a PDF or convert each page to a separate image. 100% free.',
        url: 'https://lovepdf-dun.vercel.app/pdf-to-jpg',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
