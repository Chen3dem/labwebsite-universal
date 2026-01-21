import Link from "next/link";
import { NAV_LINKS, LAB_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Address */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{LAB_NAME}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Department of Molecular Biology<br />
              University Science Center<br />
              123 Research Blvd, Lab 404<br />
              Boston, MA 02115
            </p>
            <p className="text-gray-500 text-sm">
              Email: contact@lab-website.edu
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-500 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Extra */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Google Scholar
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} {LAB_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
