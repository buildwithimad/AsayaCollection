'use client';

import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="w-full bg-[#fdfbfb]">
      {/* Container uses flexbox to stack on mobile (column) 
        and sit side-by-side on desktop (row). 
        'items-stretch' ensures both sides are equal height on desktop.
      */}
      <div className="flex flex-col lg:flex-row w-full items-stretch">
        
        {/* Left Side: Immersive Lifestyle Image */}
        <div className="relative w-full lg:w-1/2 h-[60vh] lg:h-auto min-h-[500px] lg:min-h-[800px] group overflow-hidden">
          <Image
            src="/Hero.png" // Replace with a lifestyle image of a model carrying your bag
            alt="Asaya Lifestyle and Brand Aesthetic"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-1000 ease-in-out group-hover:scale-105"
          />
          {/* Subtle overlay to ensure the image feels cohesive with the site's soft palette */}
          <div className="absolute inset-0 bg-[#faeceb]/10 mix-blend-multiply pointer-events-none"></div>
        </div>

        {/* Right Side: Brand Story Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start p-10 sm:p-16 md:p-24 lg:p-28 bg-[#faeceb]/20">
          
          <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-6 block">
            Our Philosophy
          </span>
          
          <h2 className="text-[#1a1a1a] text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-8">
            Redefining <br className="hidden md:block" />
            Modern Elegance.
          </h2>
          
          <div className="w-12 h-[1px] bg-[#1a1a1a] mb-8"></div>
          
          <p className="text-[#4a4a4a] text-sm md:text-base font-light tracking-wide leading-relaxed mb-6 max-w-md">
            At Asaya, we believe a purse is more than just an accessory; it is an extension of the woman who carries it. Born from a desire to blend timeless craftsmanship with contemporary silhouettes, every piece is meticulously designed to move with you from day to night.
          </p>
          
          <p className="text-[#4a4a4a] text-sm md:text-base font-light tracking-wide leading-relaxed mb-12 max-w-md">
            We source only the finest, ethically produced materials, ensuring that your bag not only looks exquisite but stands the test of time. Conscious luxury, crafted for the modern muse.
          </p>
          
          <button className="group relative inline-flex items-center justify-center text-[#1a1a1a] text-xs uppercase tracking-[0.2em] font-medium transition-all">
            <span className="pb-2 border-b border-[#1a1a1a]/30 group-hover:border-[#1a1a1a] transition-colors duration-300">
              Read Our Story
            </span>
          </button>
          
        </div>

      </div>
    </section>
  );
}