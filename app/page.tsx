import { ToolCard } from '@/components/ToolCard';
import { Files, Scissors, Minimize2, FileImage, FileType, Stamp, Lock, Unlock } from 'lucide-react';

const TOOLS = [
  {
    title: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: Files,
    href: "/merge"
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: Scissors,
    href: "/split"
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: Minimize2,
    href: "/compress"
  },
  {
    title: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    icon: FileType,
    href: "/pdf-to-word"
  },
  {
    title: "PDF to JPG",
    description: "Extract images from your PDF or save each page as a separate image.",
    icon: FileImage,
    href: "/pdf-to-jpg"
  },
  // Additional tools can be added here
];

export default function Home() {
  // Vercel Deployment Trigger v2
  return (
    <div className="container mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DocMorph",
            "url": "https://docmorph.online",
            "description": "Every tool you need to work with PDFs in one place. Merge, split, compress, and convert PDFs for free.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://docmorph.online/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-sm text-gray-500 mb-4">v1.1</p>
        <p className="text-xl text-gray-600">
          All the tools you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </div >
  );
}
