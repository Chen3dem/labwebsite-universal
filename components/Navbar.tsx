'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

// ORDER: Research -> Team -> Publications -> News -> Contact
const LINKS = [
  { name: 'Research', href: '/research' },
  { name: 'Team', href: '/team' },
  { name: 'Publications', href: '/publications' },
  { name: 'News & Fun', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide Navbar on Sanity Studio
  if (pathname?.startsWith('/studio')) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-4'
        : 'bg-white py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">



          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-slate-200 shadow-sm">
              <Image
                src="/lab-logo-tree.jpg"
                alt="Cui Lab Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-row items-center">
              <span className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors whitespace-nowrap">
                THE CUI LAB
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-bold uppercase tracking-wide transition-colors
                  after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100
                  ${pathname === link.href
                    ? 'text-primary after:scale-x-100'
                    : 'text-slate-600 hover:text-primary'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>



          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${isOpen ? 'text-white' : 'text-slate-900'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Portal to Body to avoid backdrop-filter issues */}
      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-start justify-center px-12 space-y-8 animate-fade-in"
        >
          {/* Close Button inside Portal */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white hover:text-primary transition-colors z-[101]"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          <div className="flex flex-col space-y-6 w-full">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-8"
            >
              <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-slate-600">
                <Image
                  src="/lab-logo-tree.jpg"
                  alt="Cui Lab Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-display font-bold text-white tracking-tight">THE CUI LAB</span>
            </Link>

            {LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-3xl font-display font-bold transition-colors flex items-center gap-4 group ${pathname === link.href ? 'text-primary' : 'text-white hover:text-primary'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}