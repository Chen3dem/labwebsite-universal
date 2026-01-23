import Image from "next/image";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pt-36 pb-16 text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section: Centered Logo */}
                <div className="flex flex-col items-center justify-center max-w-6xl mx-auto mb-20">

                    {/* Logo - Final Custom User Upload V2 */}
                    <div className="flex-shrink-0">
                        <a href="https://medschool.cuanschutz.edu/biochemistry" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
                            <Image
                                src="/cu-logo-final-v2.png"
                                alt="University of Colorado Anschutz Medical Campus - School of Medicine"
                                width={450}
                                height={150}
                                className="h-auto w-auto max-w-[450px]"
                            />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Contact Info */}
                    <div className="space-y-12">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-full flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-200 pb-4">GET IN TOUCH</h3>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Email</h4>
                                    <a href="mailto:zhicheng.cui@cuanschutz.edu" className="text-primary hover:text-rose-700 transition-colors text-xl font-medium break-all">
                                        zhicheng.cui@cuanschutz.edu
                                    </a>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Lab Address</h4>
                                    <div className="text-slate-600 font-light leading-relaxed text-lg">
                                        <p>Department of Biochemistry and Molecular Genetics</p>
                                        <p>University of Colorado School of Medicine</p>
                                        <p>Research Complex 1 South</p>
                                        <p>12801 E 17th Ave, Aurora, CO 80045</p>
                                    </div>
                                    <div className="mt-4">
                                        <a
                                            href="https://maps.google.com/?q=12801 E 17th Ave, Aurora, CO 80045"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-primary text-sm font-bold uppercase tracking-widest hover:text-slate-900 transition-colors border-b border-primary hover:border-slate-900 pb-1"
                                        >
                                            View on Google Maps &rarr;
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Join Us */}
                    <div className="space-y-12">
                        <div id="join-us" className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-full flex flex-col scroll-mt-32 lg:scroll-mt-40">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-200 pb-4">JOIN US</h3>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
                                We are looking for motivated scientists to join our team.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Postdoctoral Fellows</h4>
                                    <p className="text-slate-600 font-light text-lg">
                                        Seeking candidates with experience in biochemistry, membrane biology, structural biology, or cell biology.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Students</h4>
                                    <p className="text-slate-600 font-light text-lg">
                                        Graduate and undergraduate students are welcome to inquire.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Research Assistants</h4>
                                    <p className="text-slate-600 font-light text-lg">
                                        Positions available to support lab projects.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
