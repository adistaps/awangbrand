"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export interface GalleryImage {
    src: string;
    alt: string;
    title?: string;
}

interface ImageGalleryProps {
    images: GalleryImage[];
    heading?: string;
    description?: string;
    autoPlayInterval?: number;
    showHeader?: boolean;
    className?: string;
}

export default function ImageGallery({
    images,
    heading,
    description,
    autoPlayInterval = 3000,
    showHeader = true,
    className,
}: ImageGalleryProps) {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [autoIdx, setAutoIdx] = useState<number>(0);
    const isPausedRef = useRef(false);

    // Autoplay stabil menggunakan ref — tidak ter-reset saat hover
    useEffect(() => {
        if (images.length === 0) return;
        const timer = setInterval(() => {
            if (!isPausedRef.current) {
                setAutoIdx((prev) => (prev + 1) % images.length);
            }
        }, autoPlayInterval);
        return () => clearInterval(timer);
    }, [images.length, autoPlayInterval]);

    const focusedIdx = activeIdx !== null ? activeIdx : autoIdx;

    const handleMouseEnterGallery = () => {
        isPausedRef.current = true;
    };

    const handleMouseLeaveGallery = () => {
        isPausedRef.current = false;
        setActiveIdx(null);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .img-gallery-wrap * { font-family: 'Poppins', sans-serif; }
        
        /* Item tidak aktif: portrait sangat ramping */
        .img-gallery-item {
          flex: 0 0 80px;
          transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        @media (min-width: 640px) {
          .img-gallery-item {
            flex: 0 0 90px;
          }
        }
        @media (min-width: 1024px) {
          .img-gallery-item {
            flex: 0 0 100px;
          }
        }
        
        /* Item aktif: mengisi seluruh sisa ruang horizontal (landscape memanjang) */
        .img-gallery-item.is-active {
          flex: 1 1 0%;
        }
      `}</style>

            <section className={cn("img-gallery-wrap w-full flex flex-col items-start justify-start", className)}>
                {showHeader && (heading || description) && (
                    <div className="w-full text-left mb-6">
                        {heading && <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h2>}
                        {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
                    </div>
                )}

                {/* Full width galeri tanpa max-w pembatas */}
                <div
                    className="flex items-stretch gap-3 md:gap-4 h-[320px] sm:h-[420px] md:h-[520px] lg:h-[580px] w-full overflow-hidden"
                    onMouseEnter={handleMouseEnterGallery}
                    onMouseLeave={handleMouseLeaveGallery}
                >
                    {images.map((img, idx) => {
                        const isActive = idx === focusedIdx;
                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "img-gallery-item relative rounded-2xl overflow-hidden cursor-pointer",
                                    isActive && "is-active shadow-xl"
                                )}
                                onMouseEnter={() => setActiveIdx(idx)}
                            >
                                <img
                                    className="h-full w-full object-cover object-center"
                                    src={img.src}
                                    alt={img.alt}
                                    loading="lazy"
                                />

                                {/* Overlay gelap untuk card tidak aktif */}
                                <div
                                    className={cn(
                                        "absolute inset-0 bg-black transition-opacity duration-500",
                                        isActive ? "opacity-0" : "opacity-50"
                                    )}
                                />

                                {/* Gradient bawah + judul — hanya tampil saat card aktif */}
                                <div
                                    className={cn(
                                        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500",
                                        isActive ? "opacity-100" : "opacity-0"
                                    )}
                                />

                                {/* Judul recipe — hanya muncul saat card aktif/expand */}
                                {img.title && (
                                    <div
                                        className={cn(
                                            "absolute inset-x-0 bottom-0 px-5 pb-5 pt-10 transition-all duration-500",
                                            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                                        )}
                                    >
                                        <p className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 drop-shadow-lg">
                                            {img.title}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}