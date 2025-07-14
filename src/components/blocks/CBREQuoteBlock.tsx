"use client";

import React from 'react';
import { cn } from "@/lib/utils";
// Note: This component requires Next.js Image component when used in a Next.js app
// For non-Next.js environments, replace with a regular img tag

export interface CBREQuoteBlockProps {
  quote: string;
  author: string;
  role: string;
  imageSrc?: string;
  className?: string;
}

/**
 * CBREQuoteBlock - A styled quote block component following CBRE design
 * 
 * Features:
 * - Light gray background (#C0D4CB)
 * - Dark green left border (#012A2D)
 * - Quote with executive photo
 */
export function CBREQuoteBlock({
  quote,
  author,
  role,
  imageSrc,
  className
}: CBREQuoteBlockProps) {
  return (
    <div className={cn(
      "flex flex-col md:flex-row bg-[var(--lighter-grey)] border-l-4 border-l-[var(--dark-green)]",
      className
    )}>
      <div className="p-8 md:w-2/3 flex flex-col justify-center">
        <blockquote className="text-[var(--cbre-green)] font-financier text-xl md:text-2xl italic mb-6">
          "{quote}"
        </blockquote>
        <div>
          <p className="font-medium text-[var(--cbre-green)]">{author}</p>
          <p className="text-sm text-[var(--cbre-green)]">{role}</p>
        </div>
      </div>
      {imageSrc && (
        <div className="md:w-1/3 relative">
          <div className="h-full">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt={author} 
                className="object-cover object-center w-full h-full" 
              />
            ) : (
              <div className="bg-light-grey w-full h-full flex items-center justify-center">
                <span className="text-dark-grey">Photo Placeholder</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 