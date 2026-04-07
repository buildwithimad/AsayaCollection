'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 text-center mb-24 md:mb-32">
        <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-6 block">
          Our Heritage
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
          Redefining modern elegance through timeless design.
        </h1>
        <p className="text-[#666] text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
          Asaya Collection was born from a desire to create pieces that transcend seasons. We believe in the power of minimalism, where every stitch, every fabric, and every silhouette is chosen with absolute intention.
        </p>
      </section>

      {/* 2. THE STATEMENT QUOTE */}
      <section className="bg-[#faf9f8] border-y border-[#e5e5e5] py-24 md:py-32 mb-24 md:mb-32">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <svg className="w-8 h-8 mx-auto fill-[#e5e5e5] mb-8" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <h2 className="text-2xl md:text-4xl font-light leading-relaxed tracking-wide text-[#1a1a1a]">
            "True luxury is not about excess. It is about the perfect execution of the essential. We design for the individual who whispers rather than shouts."
          </h2>
        </div>
      </section>

      {/* 3. EDITORIAL SPLIT: THE CRAFTSMANSHIP (Image Left, Text Right) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 md:mb-32">
        <div className="relative w-full aspect-[4/5] bg-[#faeceb]/40 overflow-hidden">
          {/* Replace with your actual brand image */}
          <Image 
            src="/Hero.png" 
            alt="Asaya Craftsmanship" 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-1000"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="uppercase tracking-[0.3em] text-[#1a1a1a] text-[10px] font-bold mb-6 block border-b border-[#1a1a1a] w-fit pb-2">
            The Craftsmanship
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-snug">
            Artistry in every <br className="hidden md:block" /> single detail.
          </h2>
          <p className="text-[#666] text-sm md:text-base font-light leading-relaxed mb-6">
            We partner with generations of master artisans who share our obsession with quality. From the initial sketch to the final hand-finished seams, our process is a meticulous tribute to the art of tailoring.
          </p>
          <p className="text-[#666] text-sm md:text-base font-light leading-relaxed mb-10">
            We don't believe in fast fashion. We believe in creating wardrobe anchors—garments constructed so beautifully they can be passed down through generations.
          </p>
          <Link href="/collections" className="cursor-pointer text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a] hover:text-[#e6b93d] transition-colors w-fit flex items-center gap-4 group">
            Explore the Process
            <span className="w-8 h-[1px] bg-[#1a1a1a] group-hover:bg-[#e6b93d] group-hover:w-12 transition-all duration-300"></span>
          </Link>
        </div>
      </section>

      {/* 4. EDITORIAL SPLIT: THE MATERIALS (Text Left, Image Right) */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 md:mb-32">
        <div className="flex flex-col justify-center">
          <span className="uppercase tracking-[0.3em] text-[#1a1a1a] text-[10px] font-bold mb-6 block border-b border-[#1a1a1a] w-fit pb-2">
            The Materials
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-snug">
            Uncompromising <br className="hidden md:block" /> fabric sourcing.
          </h2>
          <p className="text-[#666] text-sm md:text-base font-light leading-relaxed mb-6">
            A garment is only as good as the canvas it is built upon. We travel the globe to source premium, sustainable textiles that feel as exquisite as they look. 
          </p>
          <p className="text-[#666] text-sm md:text-base font-light leading-relaxed mb-10">
            Whether it is our breathable organic cottons, rich wool blends, or fluid silks, every fabric is rigorously tested for drape, durability, and a remarkably soft hand-feel.
          </p>
          <Link href="/collections" className="cursor-pointer text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a] hover:text-[#e6b93d] transition-colors w-fit flex items-center gap-4 group">
            Shop the Collection
            <span className="w-8 h-[1px] bg-[#1a1a1a] group-hover:bg-[#e6b93d] group-hover:w-12 transition-all duration-300"></span>
          </Link>
        </div>
        <div className="relative w-full aspect-[4/5] bg-[#e5e5e5]/40 overflow-hidden">
          {/* Replace with a close-up texture image or second brand image */}
          <Image 
            src="/Hero.png" 
            alt="Asaya Materials" 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-1000 grayscale opacity-90"
          />
        </div>
      </section>

      {/* 5. CORE VALUES GRID */}
      <section className="bg-[#faf9f8] border-t border-[#e5e5e5] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-light mb-6 text-[#1a1a1a]">01.</span>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#1a1a1a]">Sustainability</h3>
              <p className="text-[#666] text-sm font-light leading-relaxed max-w-xs">
                Consciously crafted with respect for our planet, utilizing ethically sourced materials and low-waste production methods.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-light mb-6 text-[#1a1a1a]">02.</span>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#1a1a1a]">Longevity</h3>
              <p className="text-[#666] text-sm font-light leading-relaxed max-w-xs">
                Designed to outlast fleeting trends. We create durable wardrobe foundations that will remain relevant for years to come.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-light mb-6 text-[#1a1a1a]">03.</span>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#1a1a1a]">Transparency</h3>
              <p className="text-[#666] text-sm font-light leading-relaxed max-w-xs">
                Honest pricing and an open supply chain. You deserve to know exactly what you are paying for, and who made it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION (Dark Mode Banner) */}
      <section className="bg-[#1a1a1a] text-[#fdfbfb] py-32 text-center px-6">
        <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-6 block">
          Begin Your Journey
        </span>
        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-10">
          Experience the Asaya difference.
        </h2>
        <Link 
          href="/collections" 
          className="cursor-pointer inline-block border border-[#fdfbfb] text-[#fdfbfb] px-12 py-5 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#fdfbfb] hover:text-[#1a1a1a] transition-colors duration-500"
        >
          View Latest Arrivals
        </Link>
      </section>

    </div>
  );
}