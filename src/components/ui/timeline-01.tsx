"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface TimelineItem {
    title: string;
    description: string;
    date: string;
    image: string;
}

const awangTimelineData: TimelineItem[] = [
    {
        title: "EVENTUALLY IT GREW FROM STRENGTH TO STRENGTH",
        description:
            "Our founder, a working mom and wife herself, was struggling to feed her family healthy home-cooked meals with limited time at hand. She had an enduring passion to cook authentic Malay dishes passed down by her ancestors. From its humble start in a shop house with a few employees in 2015, Awang Brand produced its paste to the Malaysian market with an eye on the wellbeing of each and every customer.",
        date: "2015",
        image: "/time1.webp",
    },
    {
        title: "EXPANDING HORIZONS",
        description:
            "Awang Brand first big break came end of 2015 when we managed to penetrate into 10 hypermarkets. The factory expanded to add additional acreage. With the introductions of 150 varieties and comprehensive selection of pastes sold in retails, we now proudly serve our market with products covering a wide array of Asian cuisines.",
        date: "2015",
        image: "/time2.webp",
    },
];

function Timeline({ items }: { items: TimelineItem[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.getBoundingClientRect().height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 20%", "end 80%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div ref={containerRef} className="relative w-full bg-[#C8102E] text-white py-6 md:py-16 px-4 md:px-8">
            <div ref={ref} className="relative max-w-7xl mx-auto">

                {/* Garis Vertikal Utama: Di posisikan persis di left-6 (mobile), di tengah (md ke atas) */}
                <div
                    style={{ height: height + "px" }}
                    className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 w-[2px] bg-white/20 block"
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="w-full bg-gradient-to-b from-white via-amber-200 to-transparent shadow-[0_0_10px_#ffffff]"
                    />
                </div>

                {/* Daftar Item Timeline */}
                <div className="space-y-12 md:space-y-28">
                    {items.map((item, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={index}
                                className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-16 pl-12 md:pl-0"
                            >
                                {/* Dot Lingkaran: Dikunci pas di tengah garis (left-6 = 24px + 1px tengah garis = 25px) */}
                                <div className="absolute left-[25px] md:left-1/2 md:-translate-x-1/2 top-1.5 md:top-1/2 md:-translate-y-1/2 z-20 -translate-x-1/2 flex items-center justify-center">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#C8102E] border-2 border-white flex items-center justify-center shadow-lg">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                                    </div>
                                </div>

                                {/* Kolom Kiri */}
                                <div className={`w-full md:w-1/2 ${isEven ? "md:text-left md:pr-12 lg:pr-16" : "order-2 md:order-1 md:pl-12 lg:pl-16"}`}>
                                    {isEven ? (
                                        <div className="space-y-2 md:space-y-3">
                                            <span className="text-amber-200 font-extrabold text-sm sm:text-base md:text-lg block">
                                                ({item.date})
                                            </span>
                                            <h3
                                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide text-white uppercase drop-shadow-sm leading-tight"
                                                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
                                            >
                                                {item.title}
                                            </h3>
                                            <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-normal pt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl mt-3 md:mt-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Kolom Kanan */}
                                <div className={`w-full md:w-1/2 ${isEven ? "md:pl-12 lg:pl-16" : "order-1 md:order-2 md:text-left md:pr-12 lg:pr-16"}`}>
                                    {isEven ? (
                                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl mt-3 md:mt-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2 md:space-y-3">
                                            <span className="text-amber-200 font-extrabold text-sm sm:text-base md:text-lg block">
                                                ({item.date})
                                            </span>
                                            <h3
                                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide text-white uppercase drop-shadow-sm leading-tight"
                                                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
                                            >
                                                {item.title}
                                            </h3>
                                            <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-normal pt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function TimelineBlock01() {
    return (
        <section className="overflow-hidden bg-[#C8102E] text-white py-6 relative">
            {/* Garis Tipis Horizontal Persis di Atas Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-2">
                <div className="w-full h-[1px] bg-white/20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

                {/* Header Section */}
                <div className="px-4 py-6 sm:px-6 md:px-10 md:py-10 lg:px-16">
                    <div className="max-w-2xl space-y-3 sm:space-y-4">
                        <Badge
                            variant="outline"
                            className="rounded-full px-3.5 py-1 font-semibold border-white/40 text-white bg-white/10 backdrop-blur-sm text-xs sm:text-sm"
                        >
                            Timeline
                        </Badge>
                        <div className="space-y-2 sm:space-y-3">
                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase drop-shadow-md"
                                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
                            >
                                A Story Of Growth
                            </h2>
                            <p className="text-xs sm:text-base md:text-lg text-white/90 leading-relaxed font-normal">
                                Our journey reflects years of dedication to preserving authentic heritage flavors while bringing modern culinary convenience to homes worldwide.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline Component Body */}
                <div className="w-full">
                    <Timeline items={awangTimelineData} />
                </div>

            </div>
        </section>
    );
}

export default TimelineBlock01;