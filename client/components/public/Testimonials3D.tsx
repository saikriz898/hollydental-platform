"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  name: string;
  treatment: string;
  text: string;
  rating: number;
  date: string;
}

const REVIEWS: Review[] = [
  {
    name: "Sarah O'Connor",
    treatment: "Composite Bonding",
    text: "Dr. Roghay is absolutely amazing. I was terrified of going to the dentist for years, but she was incredibly gentle, patient, and explained everything step by step. My teeth bonding looks completely natural. Best dentist in Cork!",
    rating: 5,
    date: "May 2026",
  },
  {
    name: "Michael Harrington",
    treatment: "Porcelain Veneers",
    text: "Hollyhill Dental completely transformed my smile. The team is friendly, professional, and the clinic feels like a premium hotel. I couldn't be happier with my new veneers.",
    rating: 5,
    date: "April 2026",
  },
  {
    name: "Patrick Kelleher",
    treatment: "Invisalign Aligners",
    text: "I finished my Invisalign treatment here and the results are perfect. The interest-free monthly instalment plan made it super easy to pay. Highly recommend!",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "Laura Dineen",
    treatment: "Teeth Whitening",
    text: "Quick, painless, and my teeth are literally glowing. Got so many compliments at my wedding last weekend. Excellent clean clinic.",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "Emma Crowley",
    treatment: "Emergency Root Canal",
    text: "I was in agony with a toothache and they got me in on the same day. Root canal was painless. Incredible relief. Thank you!",
    rating: 5,
    date: "December 2025",
  },
];

export default function Testimonials3D() {
  const [active, setActive] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered || exitDirection) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [active, isHovered, exitDirection]);

  const handleNext = () => {
    if (exitDirection) return;
    setExitDirection("left");
    setTimeout(() => {
      setActive((prev) => (prev + 1) % REVIEWS.length);
      setExitDirection(null);
      setTilt({ x: 0, y: 0 });
    }, 400);
  };

  const handlePrev = () => {
    if (exitDirection) return;
    setExitDirection("right");
    setTimeout(() => {
      setActive((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
      setExitDirection(null);
      setTilt({ x: 0, y: 0 });
    }, 400);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStartRef.current !== null) {
      const diff = e.clientX - dragStartRef.current;
      if (diff > 80) {
        handlePrev();
        dragStartRef.current = null;
      } else if (diff < -80) {
        handleNext();
        dragStartRef.current = null;
      }
      return;
    }

    if (exitDirection) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Calculate rotation angle (max 8 degrees tilt for 3D realism)
    const rotateX = -(y - yc) / (yc / 8);
    const rotateY = (x - xc) / (xc / 8);
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    dragStartRef.current = null;
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartRef.current === null || exitDirection) return;
    const diff = e.touches[0].clientX - dragStartRef.current;
    if (diff > 50) {
      handlePrev();
      dragStartRef.current = null;
    } else if (diff < -50) {
      handleNext();
      dragStartRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    dragStartRef.current = null;
  };

  const getCardStyle = (index: number) => {
    const rel = (index - active + REVIEWS.length) % REVIEWS.length;

    let targetRel = rel;
    let isExitingCard = false;

    if (exitDirection) {
      if (rel === 0) {
        isExitingCard = true;
      } else {
        targetRel = rel - 1;
      }
    }

    if (isExitingCard) {
      return {
        transform: exitDirection === "left"
          ? "translateX(-130%) rotate(-12deg) scale(0.9)"
          : "translateX(130%) rotate(12deg) scale(0.9)",
        opacity: 0,
        zIndex: 40,
        pointerEvents: "none" as const,
        transition: "transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms ease-out",
      };
    }

    if (targetRel === 0) {
      return {
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1)`,
        opacity: 1,
        zIndex: 30,
        transition: exitDirection
          ? "transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms ease-out"
          : "transform 150ms ease-out, opacity 300ms ease-out",
      };
    }

    if (targetRel === 1) {
      return {
        transform: "perspective(1200px) scale(0.94) translateY(28px) translateZ(-40px) rotate(1deg)",
        opacity: 0.75,
        zIndex: 20,
        transition: "transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms ease-out",
      };
    }

    if (targetRel === 2) {
      return {
        transform: "perspective(1200px) scale(0.88) translateY(56px) translateZ(-80px) rotate(-1deg)",
        opacity: 0.35,
        zIndex: 10,
        transition: "transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms ease-out",
      };
    }

    return {
      transform: "perspective(1200px) scale(0.8) translateY(80px) translateZ(-120px)",
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
      transition: "transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 400ms ease-out",
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 space-y-10">
      {/* 3D Stack Viewport */}
      <div className="relative w-full max-w-2xl mx-auto h-[320px] sm:h-[280px] md:h-[260px]">
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          disabled={!!exitDirection}
          className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 transition-all z-40 focus:outline-none disabled:opacity-50"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Testimonial Stack Container */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
        >
          {REVIEWS.map((review, idx) => {
            const isFrontCard = idx === active && !exitDirection;
            return (
              <div
                key={idx}
                style={getCardStyle(idx)}
                className={`absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 origin-bottom transform-style-3d`}
              >
                {/* Quote Mark Icon in Background */}
                <span className="absolute top-2 left-4 text-7xl sm:text-8xl text-gold/10 font-serif pointer-events-none select-none">
                  &ldquo;
                </span>

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-gold">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {review.date}
                    </span>
                  </div>

                  {/* Testimony Content */}
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed italic line-clamp-4 md:line-clamp-3">
                    {review.text}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                  <div>
                    <span className="block text-sm font-bold text-gold">
                      {review.name}
                    </span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      {review.treatment}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Verified Patient
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          disabled={!!exitDirection}
          className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy hover:scale-105 active:scale-95 transition-all z-40 focus:outline-none disabled:opacity-50"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 pt-2">
        {REVIEWS.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => {
              if (exitDirection) return;
              if (dotIdx > active) {
                setExitDirection("left");
                setTimeout(() => {
                  setActive(dotIdx);
                  setExitDirection(null);
                }, 400);
              } else if (dotIdx < active) {
                setExitDirection("right");
                setTimeout(() => {
                  setActive(dotIdx);
                  setExitDirection(null);
                }, 400);
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
              dotIdx === active
                ? "w-8 bg-gold"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to testimonial slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
