import { client } from '@/sanity/client';
import Link from 'next/link';

// Define the query
const NEWS_QUERY = `*[_type == "newsPost"] | order(publishedAt desc)[0] {
  title,
  publishedAt,
  "slug": slug.current
}`;

// Define the data type
type NewsPost = {
  title: string;
  publishedAt: string;
  slug?: string;
};

export default async function Home() {
  let latestNews: NewsPost | null = null;

  try {
    latestNews = await client.fetch<NewsPost>(NEWS_QUERY);
  } catch (error) {
    console.error('Error fetching news:', error);
    // Continue rendering without news if fetch fails (e.g., due to missing config)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-cu-black text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Hello CUI Lab
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-300 font-light font-serif">
            Deciphering the molecular machines of cellular signaling & lysosomes.
          </p>
          <div className="mt-10">
             <Link href="/research" className="inline-block bg-cu-gold text-cu-black font-bold py-3 px-8 rounded-md hover:bg-yellow-500 transition-colors">
                Explore Research
             </Link>
          </div>
        </div>
      </section>

      {/* Integration Check Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h2>
           
           {latestNews ? (
             <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
               <p className="text-sm text-cu-gold font-bold uppercase tracking-wider mb-2">
                 {new Date(latestNews.publishedAt).toLocaleDateString()}
               </p>
               <h3 className="text-xl font-bold text-gray-900">
                 {latestNews.title}
               </h3>
             </div>
           ) : (
             <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
               <p className="text-gray-500 italic">
                 No news posts found yet. (CMS Integration Ready)
               </p>
             </div>
           )}
        </div>
      </section>
    </div>
  );
}
