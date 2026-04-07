'use client';

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../Ui/AddToCart";

export default function TrendingSection({ trendingProducts = [] }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!trendingProducts || trendingProducts.length === 0) return null;

  return (
    <section className="w-full py-20 md:py-28 bg-[#fdfbfb] overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 lg:px-24 mb-12 md:mb-16 gap-6">
        <div>
          <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-3 block">
            Most Desired
          </span>
          <h2 className="text-[#1a1a1a] text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
            Trending Now
          </h2>
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center border border-[#1a1a1a]/20 rounded-full hover:bg-[#1a1a1a] hover:text-[#fdfbfb] transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-current group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center border border-[#1a1a1a]/20 rounded-full hover:bg-[#1a1a1a] hover:text-[#fdfbfb] transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-current group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <Link href="/collections" className="border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] cursor-pointer text-xs uppercase tracking-[0.2em] font-medium transition-opacity hover:opacity-60">
            View All Collections
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory px-6 md:px-12 lg:px-24 pb-12 gap-6 md:gap-10 [&::-webkit-scrollbar]:hidden scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {trendingProducts.map((product) => (
          <div 
            key={product.id} 
            className="group relative flex flex-col snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[350px]"
          >
            {/* Wrap Visual Content in Link using DB Slug */}
            <Link href={`/collections/${product.slug}`} className="flex flex-col flex-1">
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] bg-[#faeceb]/40 mb-5 overflow-hidden">
                <Image
                  src={product.images?.[0] || "/Hero.png"} // DB Image fallback
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 350px"
                  className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                
                {/* Minimal Badges matching the main grid */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex flex-col gap-1 items-start pointer-events-none">
                  {product.is_best_seller && (
                    <span className="bg-[#1a1a1a] text-[#fdfbfb] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Best Seller
                    </span>
                  )}
                  {/* Since this is the trending section, we can show the trending badge if true */}
                  {product.is_trending && (
                    <span className="bg-[#fdfbfb]/80 backdrop-blur-sm text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Trending
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="bg-[#faeceb] text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Almost Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details from DB */}
              <div className="flex flex-col items-start mb-4">
                <div className="flex justify-between w-full mb-1">
                  <span className="text-[#888] text-[10px] md:text-xs uppercase tracking-[0.1em] font-medium">
                    {product.categories?.name || "Collection"}
                  </span>
                  <span className="text-[#1a1a1a] text-sm md:text-base font-medium">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[#1a1a1a] text-base font-light tracking-wide transition-colors duration-300 group-hover:text-[#666]">
                  {product.name}
                </h3>
              </div>
            </Link>

            {/* --- Buttons (Z-index ensures they work over the card link) --- */}

            {/* Desktop Quick Add (Hover only) */}
            <div className="absolute top-0 left-0 w-full aspect-[3/4] p-5 flex items-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 hidden md:flex pointer-events-none">
              <div className="w-full pointer-events-auto">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || "/Hero.png",
                  }} 
                  variant="glass" 
                />
              </div>
            </div>

            {/* Mobile Add to Cart */}
            <div className="md:hidden mt-auto relative z-20">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0] || "/Hero.png",
                }} 
                variant="outline" 
                className="py-3 text-[9px] tracking-[0.15em]" 
              />
            </div>
            
          </div>
        ))}
      </div>

      {/* Mobile-only Controls */}
      <div className="flex flex-col items-center md:hidden px-6 gap-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 flex items-center justify-center border border-[#1a1a1a]/20 rounded-full active:bg-[#1a1a1a] active:text-[#fdfbfb] transition-all duration-300"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 flex items-center justify-center border border-[#1a1a1a]/20 rounded-full active:bg-[#1a1a1a] active:text-[#fdfbfb] transition-all duration-300"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <Link href="/collections" className="w-full text-center border border-[#1a1a1a] text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-medium py-4">
          View All Collections
        </Link>
      </div>

    </section>
  );
}