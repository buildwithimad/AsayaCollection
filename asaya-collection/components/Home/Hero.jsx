'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth entrance timer
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ENTER ANIMATION (FADE-UP) */
        .fade-up {
          opacity: 0;
          transform: translateY(25px);
          transition: 
            opacity 1.5s cubic-bezier(0.19, 1, 0.22, 1), 
            transform 1.5s cubic-bezier(0.19, 1, 0.22, 1), 
            border-radius 1.5s cubic-bezier(0.19, 1, 0.22, 1),
            box-shadow 1.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .fade-up.active {
          opacity: 1;
          transform: translateY(0);
        }

        /* SCROLL INDICATOR ANIMATION */
        .scroll-line {
          width: 1px;
          height: 70px;
          background: linear-gradient(to bottom, #1a1a1a 50%, transparent 50%);
          background-size: 100% 200%;
          background-position: 100% 100%;
          animation: scrollDown 2.2s cubic-bezier(0.76, 0, 0.24, 1) infinite;
        }
        @keyframes scrollDown {
          0% { background-position: 100% 100%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 100% -100%; }
        }
      `}} />

      <section className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#fdfbfb] via-[#fdfbfb] to-[#faeceb]/40 flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 mt-12 md:mt-20">
        
        {/* --- FLOATING EDITORIAL TEXT (LEFT) - Appears on MD --- */}
        <div 
          className={`absolute top-[28%] left-10 lg:left-16 z-20 hidden md:block fade-up ${isLoaded ? 'active' : ''}`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center gap-4 mb-3.5">
            <span className="w-9 h-px bg-[#1a1a1a]"></span>
            <p className="uppercase tracking-[0.35em] text-[#1a1a1a] font-medium text-[9px]">
              Timeless
            </p>
          </div>
          <p className="text-[#555] text-sm lg:text-base font-light tracking-wide leading-relaxed font-serif">
            Meticulously <br />
            crafted for every <br />
            modern silhouette.
          </p>
        </div>

        {/* --- FLOATING EDITORIAL TEXT (RIGHT) - Appears on MD --- */}
        <div 
          className={`absolute top-[28%] right-10 lg:right-16 z-20 hidden md:block text-right fade-up ${isLoaded ? 'active' : ''}`}
          style={{ transitionDelay: '550ms' }}
        >
          <div className="flex items-center justify-end gap-4 mb-3.5">
            <p className="uppercase tracking-[0.35em] text-[#1a1a1a] font-medium text-[9px]">
              Elegant
            </p>
            <span className="w-9 h-px bg-[#1a1a1a]"></span>
          </div>
          <p className="text-[#555] text-sm lg:text-base font-light tracking-wide leading-relaxed font-serif">
            Designs made to <br />
            elevate the everyday <br />
            wardrobe foundations.
          </p>
        </div>

        {/* --- CENTER CINEMATIC IMAGE CONTAINER --- */}
        <Link 
          href="/collections"
          className={`relative z-20 group cursor-pointer mt-[-5svh] md:mt-0 fade-up ${isLoaded ? 'active' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div 
            className="relative w-[90vw] md:w-[75vw] lg:w-[1100px] aspect-[4/5] md:aspect-[2/1] overflow-hidden bg-[#f4d9db]/20 shadow-[0_15px_60px_-10px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_100px_-10px_rgba(0,0,0,0.06)] group-hover:-translate-y-2.5 transition-all duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
            // The Arch: percentage-based for smoothness and adapting to width
            style={{ borderRadius: isLoaded ? '48% 48% 5% 5% / 70% 70% 8% 8%' : '5% 5% 5% 5% / 5% 5% 5% 5%' }} 
          >
            <Image
              src="/Hero.png" 
              alt="Asaya New Collection Arrivals"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 1100px"
              className="object-cover object-center transition-transform duration-[2.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-108"
            />
            {/* Soft Cinematic darkening overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80 group-hover:opacity-10 transition-opacity duration-[1.5s]"></div>
          </div>
        </Link>

        {/* --- MASSIVE OVERLAPPING TITLE --- */}
        <div 
          className={`absolute bottom-[10%] md:bottom-[7%] w-full flex flex-col items-center z-30 pointer-events-none px-4 fade-up ${isLoaded ? 'active' : ''}`}
          style={{ transitionDelay: '650ms' }}
        >
          <h1 className="text-[#1a1a1a] text-center text-[22vw] sm:text-[16vw] md:text-[14vw] lg:text-[13rem] font-light tracking-tighter leading-[0.8] mix-blend-multiply opacity-95 drop-shadow-sm font-serif">
            Asaya
          </h1>
          <span className="text-[#1a1a1a] tracking-[0.6em] md:tracking-[0.9em] text-[10px] md:text-xs uppercase mt-3 md:mt-1 font-medium opacity-90">
            Collection
          </span>
        </div>

       

      </section>
    </>
  );
}