"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

// Area crop dalam fraksi (0 sampai 1) dari peta dunia penuh
interface Crop {
  x: number; // batas kiri
  y: number; // batas atas
  w: number; // lebar
  h: number; // tinggi
}

type LabelPosition = "top" | "bottom";

interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
  labelPosition?: LabelPosition; // default: "top"
}

interface MapProps {
  dots?: Array<{
    start: MapPoint;
    end: MapPoint;
  }>;
  lineColor?: string;
  showLabels?: boolean;
  labelClassName?: string;
  animationDuration?: number;
  loop?: boolean;
  backgroundColor?: string;
  dotColor?: string;
  crop?: Crop;
  className?: string;
}

// Menampilkan sisi kanan peta: Afrika, Eropa, Asia, Australia (tanpa benua Amerika)
const DEFAULT_CROP: Crop = { x: 0.41, y: 0, w: 0.59, h: 1 };

// Titik awal Malaysia (Kuala Lumpur) -> London
const defaultDots: NonNullable<MapProps["dots"]> = [
  {
    start: { lat: 3.139, lng: 101.6869, label: "Malaysia" },
    end: { lat: 51.5072, lng: -0.1276, label: "London" },
  },
];

const VIEW_W = 800;

export function WorldMap({
  dots = defaultDots,
  lineColor = "#CC0000",
  showLabels = true,
  labelClassName = "text-xs sm:text-sm",
  animationDuration = 2,
  loop = true,
  backgroundColor = "transparent",
  dotColor = "#262626",
  crop = DEFAULT_CROP,
  className = "",
}: MapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Peta dunia penuh, sama seperti kode awal
  const map = useMemo(
    () => new DottedMap({ height: 100, grid: "diagonal" }),
    []
  );

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.28,
        color: dotColor,
        shape: "circle",
        backgroundColor: backgroundColor,
      }),
    [map, dotColor, backgroundColor]
  );

  // width/height bersifat private di tipe TypeScript, tapi tersedia saat runtime
  const { mapW, mapH } = useMemo(() => {
    const m = map as unknown as { width: number; height: number };
    return { mapW: m.width, mapH: m.height };
  }, [map]);

  // Tinggi viewBox mengikuti rasio area crop
  const viewH = VIEW_W * ((crop.h * mapH) / (crop.w * mapW));
  const viewBox = `0 0 ${VIEW_W} ${viewH}`;

  const projectPoint = (lat: number, lng: number) => {
    const pin = map.getPin({ lat, lng });
    let fx: number;
    let fy: number;
    if (pin) {
      fx = pin.x / mapW;
      fy = pin.y / mapH;
    } else {
      fx = (lng + 180) / 360;
      fy = (90 - lat) / 180;
    }
    // Ubah posisi di peta penuh menjadi posisi di area crop
    return {
      x: ((fx - crop.x) / crop.w) * VIEW_W,
      y: ((fy - crop.y) / crop.h) * viewH,
    };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Posisi badge: di atas titik (default) atau di bawah titik
  const labelY = (pointY: number, position: LabelPosition = "top") =>
    position === "bottom" ? pointY + 8 : pointY - 42;

  // Calculate animation timing
  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2; // Pause for 2 seconds when all paths are drawn
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div
      className={`w-full relative font-sans overflow-hidden ${className}`}
      style={{ aspectRatio: `${VIEW_W} / ${viewH}` }}
    >
      {/* Peta penuh yang diperbesar dan digeser, sehingga hanya area crop yang terlihat */}
      <div
        className="absolute"
        style={{
          width: `${100 / crop.w}%`,
          height: `${100 / crop.h}%`,
          left: `${-(crop.x / crop.w) * 100}%`,
          top: `${-(crop.y / crop.h) * 100}%`,
        }}
      >
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full object-fill [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] pointer-events-none select-none"
          alt="world map"
          height={Math.round((1056 * mapH) / mapW)}
          width={1056}
          draggable={false}
          priority
        />
      </div>

      <svg
        viewBox={viewBox}
        className="w-full h-full absolute inset-0 pointer-events-auto select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          // Calculate keyframe times for this specific path
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                      duration: fullCycleDuration,
                      times: [0, startTime, endTime, resetTime, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 0,
                    }
                    : {
                      duration: animationDuration,
                      delay: i * staggerDelay,
                      ease: "easeInOut",
                    }
                }
              />

              {loop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${createCurvedPath(startPoint, endPoint)}')`,
                  }}
                />
              )}
            </g>
          );
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`points-group-${i}`}>
              {/* Start Point */}
              <g key={`start-${i}`}>
                <motion.g
                  onHoverStart={() => setHoveredLocation(dot.start.label || `Location ${i}`)}
                  onHoverEnd={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="4.5"
                    fill={lineColor}
                    filter="url(#glow)"
                    className="drop-shadow-md"
                  />
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="4.5"
                    fill={lineColor}
                    opacity="0.35"
                  >
                    <animate
                      attributeName="r"
                      from="4.5"
                      to="14"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </motion.g>

                {showLabels && dot.start.label && (
                  <motion.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 * i + 0.3, duration: 0.5 }}
                    className="pointer-events-none"
                  >
                    <foreignObject
                      x={startPoint.x - 65}
                      y={labelY(startPoint.y, dot.start.labelPosition)}
                      width="130"
                      height="38"
                      className="block overflow-visible"
                    >
                      <div className="flex items-center justify-center h-full">
                        <span
                          className={`font-bold px-4 py-1.5 rounded-full bg-black text-white shadow-lg border border-black/40 tracking-tight whitespace-nowrap select-none ${labelClassName}`}
                        >
                          {dot.start.label}
                        </span>
                      </div>
                    </foreignObject>
                  </motion.g>
                )}
              </g>

              {/* End Point */}
              <g key={`end-${i}`}>
                <motion.g
                  onHoverStart={() => setHoveredLocation(dot.end.label || `Destination ${i}`)}
                  onHoverEnd={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="4.5"
                    fill={lineColor}
                    filter="url(#glow)"
                    className="drop-shadow-md"
                  />
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="4.5"
                    fill={lineColor}
                    opacity="0.35"
                  >
                    <animate
                      attributeName="r"
                      from="4.5"
                      to="14"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="2s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </motion.g>

                {showLabels && dot.end.label && (
                  <motion.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 * i + 0.5, duration: 0.5 }}
                    className="pointer-events-none"
                  >
                    <foreignObject
                      x={endPoint.x - 65}
                      y={labelY(endPoint.y, dot.end.labelPosition)}
                      width="130"
                      height="38"
                      className="block overflow-visible"
                    >
                      <div className="flex items-center justify-center h-full">
                        <span
                          className={`font-bold px-4 py-1.5 rounded-full bg-black text-white shadow-lg border border-black/40 tracking-tight whitespace-nowrap select-none ${labelClassName}`}
                        >
                          {dot.end.label}
                        </span>
                      </div>
                    </foreignObject>
                  </motion.g>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Mobile Tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 text-black dark:text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm sm:hidden border border-gray-200 dark:border-gray-700"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}