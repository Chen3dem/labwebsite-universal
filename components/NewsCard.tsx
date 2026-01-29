import { format } from "date-fns";

interface NewsCardProps {
    title: string;
    publishedAt: string;
    excerpt: string;
}

export default function NewsCard({ title, publishedAt, excerpt }: NewsCardProps) {
    return (
        <div className="border-l-4 border-primary pl-4 py-1">
            <div className="mb-1 text-sm text-slate-500">
                {publishedAt ? format(new Date(publishedAt), "MMMM d, yyyy") : "Date TBD"}
            </div>
            <h3 className="text-lg font-display font-semibold text-slate-900">
                {title}
            </h3>
            <p className="mt-1 text-slate-600 text-sm line-clamp-2">{excerpt}</p>
        </div>
    );
}
