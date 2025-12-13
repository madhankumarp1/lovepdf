import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
}

export function ToolCard({ title, description, icon: Icon, href }: ToolCardProps) {
    return (
        <Link href={href} className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-rose-100 transition-all group">
            <div className="bg-rose-50 p-3 rounded-lg mb-4 text-rose-600 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </Link>
    );
}
