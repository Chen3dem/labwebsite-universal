import Link from 'next/link';
import Image from 'next/image';
import QuoteOfTheDay from './QuoteOfTheDay';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-4 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Quote of the Day Section */}
        <div className="mb-4 border-b border-slate-800 pb-4">
          <h4 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Daily Inspiration</h4>
          <QuoteOfTheDay />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-12 lg:gap-24 text-sm max-w-7xl mx-auto">
          {/* Column 1: Logo & Address */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                {/* Lab Logo - Round Mask */}
                <div className="relative w-12 h-12 overflow-hidden rounded-full border border-slate-800 group-hover:border-primary transition-colors flex-shrink-0">
                  <Image
                    src="/lab-logo-tree.jpg"
                    alt="Cui Lab Logo"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center gap-0">
                  {/* Lab Name */}
                  <h3 className="text-xl font-display font-bold text-white tracking-wider group-hover:text-primary transition-colors whitespace-nowrap">
                    Cui Lab @
                  </h3>

                  {/* Anschutz Logo */}
                  <div className="relative w-40 h-10 opacity-80 group-hover:opacity-100 transition-opacity -ml-3">
                    <Image
                      src="/cu-anschutz-footer.png"
                      alt="CU Anschutz"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </Link>
            <div className="text-slate-400 font-light leading-relaxed space-y-1">
              <p>Department of Biochemistry and Molecular Genetics</p>
              <p>University of Colorado School of Medicine</p>
              <p>Research Complex 1 South</p>
              <p>12801 E 17th Ave, Aurora, CO 80045</p>
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
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:zhicheng.cui@cuanschutz.edu" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                  Email Us
                </a>
              </li>
              <li className="flex gap-4 pt-1">
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/zhicheng-chen-cui-318978108/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors transform hover:-translate-y-1 duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                {/* Bluesky */}
                <a href="https://bsky.app/profile/chen3dem.bsky.social" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors transform hover:-translate-y-1 duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 .944 1.561 1.266.902 1.565-.131 2.032-.784 4.406.864 6.953c.843 1.303 3.85 5.617 3.85 5.617s-2.738.995-3.047 1.139c-.838.396-1.782 1.258-1.571 3.425.138 1.416 1.176 3.655 4.103 3.899 3.149.263 5.483-2.071 7.801-6.148 2.318 4.077 4.652 6.411 7.801 6.148 2.927-.244 3.965-2.483 4.103-3.899.211-2.167-.733-3.029-1.571-3.425-.309-.144-3.047-1.139-3.047-1.139s3.007-4.314 3.85-5.617c1.648-2.547.995-4.921-.038-5.388-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.protocols.io/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                  Protocols.io
                </a>
              </li>
              <li>
                <a href="https://www.benchling.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                  Benchling
                </a>
              </li>
              <li>
                <a href="https://www.addgene.org/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                  Addgene
                </a>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">
                  PubMed
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} Cui Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}