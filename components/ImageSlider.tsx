'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderImage {
    _id: string;
    title?: string;
    imageUrl: string;
    caption?: string;
}

interface ImageSliderProps {
    images: SliderImage[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-[500px] overflow-hidden rounded-lg bg-gray-900 group border border-white/10">
            {/* Images */}
            {images.map((img, index) => (
                <div
                    key={img._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <Image
                        src={img.imageUrl}
                        alt={img.title || 'Gallery Image'}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Caption Overlay */}
                    {(img.title || img.caption) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            {img.title && <h3 className="font-bold text-lg mb-1">{img.title}</h3>}
                            {img.caption && <p className="text-sm font-light text-gray-300">{img.caption}</p>}
                        </div>
                    )}
                </div>
            ))}

            {/* Navigation Buttons (Only if > 1 image) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Next Slide"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
