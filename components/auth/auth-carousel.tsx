"use client";

import { useEffect, useState } from "react";
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

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % SLIDES.length),
      4500,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative hidden h-full overflow-hidden bg-accent md:block">
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((item) => (
          <div
            key={item.title}
            className="relative min-w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/25 via-accent/55 to-accent/85" />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[60px] z-10 px-10 text-primary-foreground">
        <h2 className="mb-2 text-balance text-[clamp(1.4rem,2.2vw,2rem)] font-bold leading-tight drop-shadow-md">
          {slide.title}
        </h2>
        <p className="text-sm opacity-85">{slide.sub}</p>
      </div>

      <div className="absolute bottom-7 left-10 z-10 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full bg-primary-foreground/40 transition-all",
              current === index ? "w-[22px] rounded bg-primary-foreground" : "w-2",
            )}
          />
        ))}
      </div>
    </div>
  );
}
