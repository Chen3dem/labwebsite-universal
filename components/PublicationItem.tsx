interface PublicationProps {
    title: string;
    authors: string;
    journal: string;
    publishedAt: string;
    url?: string;
    file?: string;
}

export default function PublicationItem({ title, authors, journal, publishedAt, url, file }: PublicationProps) {
    const year = publishedAt ? new Date(publishedAt).getFullYear() : "";

    return (
        <div className="py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors p-4 -mx-4 rounded-lg">
            <h3 className="text-lg font-display font-semibold text-slate-900">
                <a href={url || file || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">
                    {title}
                </a>
            </h3>
            <div className="text-slate-700 mt-1">
                {authors}
            </div>
            <div className="text-sm text-slate-500 mt-1 italic">
                {journal} {year && <span>({year})</span>}
            </div>
            <div className="mt-2 flex gap-3 text-sm font-medium">
                {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-rose-700 flex items-center">
                        View Article
                    </a>
                )}
                {file && (
                    <a href={file} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-rose-700 flex items-center">
                        Download PDF
                    </a>
                )}
            </div>
        </div>
    );
}
