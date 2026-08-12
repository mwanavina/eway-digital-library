"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image:
      "/pexels-yaroslav-shuraev-6279974.jpg?w=900&q=80",
    title: "Welcome to Eway Management System",
    sub: "Find library e-resources here",
  },
  {
    image:
      "/pexels-yankrukov-8199249.jpg?w=900&q=80",
    title: "Access Academic Resources Anytime",
    sub: "Past-Papers, Course-Outlines and more at your fingertips",
  },
  {
    image:
      "/pexels-mikhail-nilov-9158716.jpg?w=900&q=80",
    title: "Learn Without Limits",
    sub: "Your gateway to knowledge across all disciplines",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80",
    title: "Learning Made Easy",
    sub: "Thousands of papers and study materials available",
  },
  {
    image:
      "/pexels-mikhail-nilov-8653642.jpg?w=900&q=80",
    title: "Stay Connected to Your Campus",
    sub: "Share resources with peers",
  },
  {
    image:
      "/pexels-yankrukov-8199256.jpg?w=900&q=80",
    title: "Your Library, Your Way",
    sub: "Access your library resources anytime, anywhere",
  },
];

const TRANSITION_MS = 700;
const extendedSlides = [...SLIDES, SLIDES[0]];

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const activeSlideIndex = current === SLIDES.length ? 0 : current;
  const slide = SLIDES[activeSlideIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (current !== SLIDES.length) return;

    const timeout = window.setTimeout(() => {
      setEnableTransition(false);
      setCurrent(0);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [current]);

  useEffect(() => {
    if (enableTransition) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnableTransition(true);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [enableTransition]);

  const handleDotClick = useCallback((index: number) => {
    setEnableTransition(true);
    setCurrent(index);
  }, []);

  return (
    <div className="relative hidden h-full overflow-hidden bg-[#1782C5] md:block">
      <div
        className="flex h-full will-change-transform"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: enableTransition
            ? `transform ${TRANSITION_MS}ms cubic-bezier(0.77, 0, 0.18, 1)`
            : "none",
        }}
      >
        {extendedSlides.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="relative h-full w-full shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[60px] z-10 px-10 text-white">
        <h2 className="mb-2 text-balance text-[clamp(1.4rem,2.2vw,2rem)] font-bold leading-tight text-white drop-shadow-md">
          {slide.title}
        </h2>
        <p className="text-sm text-white/85">{slide.sub}</p>
      </div>

      <div className="absolute bottom-7 left-10 z-10 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Slide ${index + 1}`}
            onClick={() => handleDotClick(index)}
            className={cn(
              "h-2 rounded-full bg-white/40 transition-all",
              activeSlideIndex === index ? "w-[22px] rounded bg-white" : "w-2",
            )}
          />
        ))}
      </div>
    </div>
  );
}
