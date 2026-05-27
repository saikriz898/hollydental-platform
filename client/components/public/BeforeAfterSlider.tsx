"use client";

import { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  treatmentName?: string;
  initials?: string;
}

export default function BeforeAfterSlider({
  beforeImage = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600",
  afterImage = "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600",
  treatmentName = "Composite Bonding",
  initials = "S.O.",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSplit = beforeImage === afterImage;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[280px] md:h-[360px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-gray-100 shadow-card"
    >
      {/* Before Image (underneath) */}
      {isSplit ? (
        <div className="absolute inset-0 overflow-hidden w-full h-full">
          <img
            src={beforeImage}
            alt="Before Treatment"
            className="absolute w-full h-[200%] object-cover top-0 left-0"
            draggable="false"
            style={{ width: containerWidth !== undefined ? `${containerWidth}px` : undefined }}
          />
        </div>
      ) : (
        <img
          src={beforeImage}
          alt="Before Treatment"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      )}
      <div className="absolute top-4 left-4 bg-navy/80 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase z-20">
        Before
      </div>

      {/* After Image (clipped layer on top) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden z-10"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        {isSplit ? (
          <div className="absolute inset-0 overflow-hidden w-full h-full">
            <img
              src={afterImage}
              alt="After Treatment"
              className="absolute w-full h-[200%] object-cover left-0"
              style={{ 
                top: "-100%",
                width: containerWidth !== undefined ? `${containerWidth}px` : undefined 
              }}
              draggable="false"
            />
          </div>
        ) : (
          <img
            src={afterImage}
            alt="After Treatment"
            className="absolute inset-0 w-full h-full object-cover"
            draggable="false"
            style={{ 
              width: containerWidth !== undefined 
                ? `${containerWidth}px` 
                : containerRef.current?.getBoundingClientRect().width 
                  ? `${containerRef.current.getBoundingClientRect().width}px` 
                  : undefined 
            }}
          />
        )}
        <div className="absolute top-4 right-4 bg-gold/90 text-navy text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase z-20">
          After
        </div>
      </div>

      {/* Slider Line Handler */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gold z-30 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Circle thumb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy border-2 border-gold flex items-center justify-center shadow-lg text-gold font-bold text-sm">
          &harr;
        </div>
      </div>

      {/* Bottom Metadata Label */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
        <span className="bg-navy/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
          {treatmentName}
        </span>
        <span className="bg-gold/80 text-navy text-xs font-bold px-3 py-1.5 rounded-lg">
          Patient: {initials}
        </span>
      </div>
    </div>
  );
}
