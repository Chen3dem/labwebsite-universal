'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';

interface HeroSliderProps {
    images: any[]; // Sanity image objects
    fit?: 'contain' | 'cover';
}

export default function HeroSlider({ images, fit = 'contain' }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={urlFor(images[currentIndex]).url()}
                        alt={`Hero slide ${currentIndex + 1}`}
                        fill
                        className={`object-${fit}`}
                        priority={currentIndex === 0}
                    />
                </motion.div>
            </AnimatePresence>


            {/* Dots Navigation */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'bg-primary w-6'
                                : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
