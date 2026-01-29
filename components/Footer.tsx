import Link from 'next/link';
import Image from 'next/image';
import QuoteOfTheDay from './QuoteOfTheDay';

import { urlFor } from '@/sanity/lib/image';

interface FooterProps {
  siteSettings?: {
    labName?: string;
    logo?: any;
    institutionLogo?: any;
    footerAddress?: string[];
    contactEmail?: string;
    socialKey?: Array<{
      platform: string;
      url: string;
    }>;
    quickLinks?: Array<{
      label: string;
      url: string;
    }>;
  };
}

export default function Footer({ siteSettings }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 py-4 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Quote of the Day Section */}
        <div className="mb-4 border-b border-slate-800 pb-4">
          <h4 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Daily Inspiration</h4>
          <QuoteOfTheDay />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 lg:gap-12 text-sm max-w-7xl mx-auto">
          {/* Column 1: Logo & Address */}
          <div className="col-span-3 md:col-span-3 space-y-3 max-w-md relative">
            {/* Gradient decorative blob for mobile only, maybe too much? leaving it out for now to keep it clean */}
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2">
                  {/* Lab Name */}
                  <h3 className="text-xl font-display font-bold text-white tracking-wider group-hover:text-primary transition-colors whitespace-nowrap">
                    {siteSettings?.labName || "Edit in Sanity Studio"}
                  </h3>

                  {/* Institution Logo */}
                  <div className="relative w-40 h-10 opacity-80 group-hover:opacity-100 transition-opacity -ml-3 flex items-center">
                    {siteSettings?.institutionLogo?.asset ? (
                      <Image
                        src={urlFor(siteSettings.institutionLogo).url()}
                        alt="Institution Logo"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="border border-dashed border-slate-700 bg-slate-900/50 rounded w-full h-full flex items-center justify-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest text-center px-1">Logo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            <div className="text-slate-400 font-light leading-relaxed space-y-1">
              {siteSettings?.footerAddress ? (
                siteSettings.footerAddress.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))
              ) : (
                <>
                  <>
                    <p className="italic text-slate-500">Add your lab address in Sanity Studio</p>
                    <p className="text-xs text-slate-600">(Site Settings &gt; Footer Address)</p>
                  </>
                </>
              )}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Navigate</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Home</Link></li>
              <li><Link href="/research" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Research</Link></li>
              <li><Link href="/team" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Team</Link></li>
              <li><Link href="/publications" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Publications</Link></li>
              <li><Link href="/news" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">News & Fun</Link></li>
              <li><Link href="/intranet" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Intranet</Link></li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${siteSettings?.contactEmail || 'zhicheng.cui@cuanschutz.edu'}`} className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                  Email Us
                </a>
              </li>
              <li className="flex gap-4 pt-1">
                {siteSettings?.socialKey?.map((social) => (
                  <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors transform hover:-translate-y-1 duration-200" title={social.platform}>
                    {/* Generic Icon if specific one not matched, logic simplifed for now */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.06z" />
                    </svg>
                  </a>
                ))}
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-2">
              {siteSettings?.quickLinks ? (
                siteSettings.quickLinks.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                      {link.label}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-slate-600">No links configured</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} {siteSettings?.labName || "Your Lab Name"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}