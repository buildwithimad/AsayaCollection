'use client';

import Image from "next/image";

// Enhanced dummy data with catalog numbering
const categories = [
  {
    id: 1,
    num: "01",
    title: "The Totes",
    subtitle: "Spacious & Structured",
    image: "/Hero.png", // Replace with your image paths
    // Using custom grid column spans for a more editorial layout
    span: "lg:col-span-7", 
  },
  {
    id: 2,
    num: "02",
    title: "Crossbody",
    subtitle: "Hands-Free Elegance",
    image: "/Hero.png",
    span: "lg:col-span-5",
  },
  {
    id: 3,
    num: "03",
    title: "Evening Clutches",
    subtitle: "For the Night Out",
    image: "/Hero.png",
    span: "lg:col-span-12", // Takes full width at the bottom for impact
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full py-24 md:py-32 px-4 md:px-8 lg:px-16 bg-[#fdfbfb]">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <span className="uppercase tracking-[0.4em] text-[#1a1a1a]/50 text-[10px] sm:text-xs font-semibold mb-4 block">
          Curated Silhouettes
        </span>
        <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tighter">
          Shop by Category
        </h2>
      </div>

      {/* 12-Column Editorial Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 max-w-[1400px] mx-auto">
        
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className={`relative group overflow-hidden cursor-pointer w-full bg-[#faeceb]/30 ${category.span} 
              ${index === 2 ? 'h-[50vh] md:h-[60vh]' : 'h-[50vh] lg:h-[80vh]'}
            `}
          >
            {/* Cinematic Image Zoom */}
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
            />
            
            {/* Dynamic Vignette Overlay (Darkens slightly on hover for text clarity) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
            
            {/* Catalog Number - Top Right */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20 mix-blend-overlay">
              <span className="text-[#fdfbfb] text-sm md:text-base font-light tracking-widest">
                {category.num}
              </span>
            </div>

            {/* Hover Reveal Text Container */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col items-start translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
              
              <span className="text-[#fdfbfb]/80 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 font-medium">
                {category.subtitle}
              </span>
              
              <h3 className="text-[#fdfbfb] text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-6">
                {category.title}
              </h3>
              
              {/* Button fades in and slides up slightly later than the rest of the text */}
              <div className="overflow-hidden">
                <span className="inline-block text-[#fdfbfb] cursor-pointer border-b border-[#fdfbfb]/30 pb-1 text-xs md:text-sm uppercase tracking-[0.15em] font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100 group-hover:border-[#fdfbfb]">
                  Explore Collection
                </span>
              </div>
              
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}