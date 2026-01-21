import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-cu-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-cu-gold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Department of Molecular & Cell Biology<br />
              University of California, Berkeley<br />
              Berkeley, CA 94720
            </p>
            <p className="mt-4 text-gray-300">
              Email: <a href="mailto:zhicheng.cui@berkeley.edu" className="hover:text-cu-gold transition-colors">zhicheng.cui@berkeley.edu</a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-cu-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Research', 'Publications', 'Team', 'News', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-bold text-cu-gold mb-4">CUI Lab</h3>
            <p className="text-gray-300 text-sm">
              Deciphering the molecular machines of cellular signaling & lysosomes.
            </p>
            <p className="mt-8 text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CUI Lab. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}