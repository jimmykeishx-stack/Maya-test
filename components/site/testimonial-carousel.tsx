"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { testimonials } from "@/data/site";

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section className="section-space">
      <div className="site-shell grid gap-8 rounded-[2.2rem] border border-black/6 bg-[rgba(255,251,244,0.76)] px-6 py-10 shadow-[0_24px_80px_rgba(15,12,8,0.06)] md:grid-cols-[0.7fr_1.3fr] md:px-10">
        <div>
          <p className="quiet-label text-[var(--gold-strong)]">Client Perspective</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">A calm, premium experience for decisive buyers.</h2>
        </div>
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-3xl leading-snug text-balance md:text-[2.5rem]">“{active.quote}”</p>
              <p className="mt-6 text-sm uppercase tracking-[0.28em] text-muted-foreground">
                {active.name} • {active.role}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-12 bg-[var(--gold-strong)]" : "w-6 bg-black/10"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
