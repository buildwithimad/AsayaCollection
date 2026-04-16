'use client';

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../Ui/AddToCart";
import { useCartStore } from '@/store/cartStore'; // 🌟 Added Zustand store

export default function TrendingSection({ trendingProducts = [] }) {
  const carouselRef = useRef(null);

  // 🌟 Pull the cart at the top level
  const cart = useCartStore((state) => state.cart || []);

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
    <section className="w-full py-24 md:py-32 bg-[#fdfbfb] overflow-hidden">
      
      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 lg:px-24 mb-12 gap-6">
        <div>
          <span className="uppercase tracking-[0.4em] text-[#888] text-[9px] md:text-[10px] font-bold mb-4 block">
            Most Desired
          </span>
          <h2 className="text-[#1a1a1a] text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
            Trending Now
          </h2>
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="/collections" className="group flex items-center gap-3 text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="pb-1 border-b border-transparent group-hover:border-[#1a1a1a] transition-colors">
              View Collection
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center border border-[#e5e5e5] hover:border-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-[#fdfbfb] transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-current group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center border border-[#e5e5e5] hover:border-[#1a1a1a] rounded-full hover:bg-[#1a1a1a] hover:text-[#fdfbfb] transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-current group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- PRODUCT CAROUSEL --- */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory px-6 md:px-12 lg:px-24 pb-12 gap-4 md:gap-8 [&::-webkit-scrollbar]:hidden scroll-smooth"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {trendingProducts.map((product) => {
          
          // 🌟 CALCULATE OUT OF STOCK STATUS FOR THIS SPECIFIC PRODUCT
          const cartItem = cart.find(item => item.id === product.id);
          const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
          const isOutOfStock = product.stock === 0 || currentQuantityInCart >= product.stock;

          return (
            <div 
              key={product.id} 
              className="group relative flex flex-col snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[320px] lg:w-[360px]"
            >
              {/* Image Container with Elegant Slide-Up Hover Effect */}
              <div className="relative w-full aspect-[3/4] bg-[#faf9f8] mb-5 overflow-hidden">
                <Link href={`/collections/${product.slug}`} className="absolute inset-0 z-0">
                  <Image
                    src={product.images?.[0] || "/Hero.png"} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 360px"
                    className="object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                  />
                </Link>
                
                {/* Ultra-Minimal Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
                  {/* 🌟 New Out of Stock Badge */}
                  {product.stock === 0 ? (
                    <span className="bg-white/90 backdrop-blur-md text-[#b33a3a] px-2.5 py-1 text-[8px] uppercase tracking-[0.25em] font-bold shadow-sm">
                      Out of Stock
                    </span>
                  ) : (
                    <>
                      {product.is_trending && (
                        <span className="bg-white/90 backdrop-blur-md text-[#1a1a1a] px-2.5 py-1 text-[8px] uppercase tracking-[0.25em] font-bold shadow-sm">
                          Trending
                        </span>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-[#faeceb] text-[#b33a3a] px-2.5 py-1 text-[8px] uppercase tracking-[0.25em] font-bold shadow-sm">
                          Only {product.stock} Left
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Desktop Quick Add */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-20 hidden md:block">
                  <AddToCartButton 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || "/Hero.png",
                      stock: product.stock, // 🌟 Must pass stock
                    }} 
                    variant="glass" 
                    disabled={isOutOfStock} // 🌟 Disables button if limit is reached
                  />
                </div>
              </div>

              {/* --- E-COMMERCE STRUCTURED TEXT BLOCK --- */}
              <div className="flex flex-col w-full">
                
                {/* Row 1: Category & Ratings */}
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="text-[#888] text-[9px] uppercase tracking-[0.2em] font-bold">
                    {product.categories?.name || "Collection"}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.rating || 0) ? 'fill-[#ebb626]' : 'fill-[#e5e5e5]'}`} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[9px] text-[#aaa] font-medium tracking-widest mt-0.5">({product.reviews_count || 0})</span>
                  </div>
                </div>

                {/* Row 2: Product Title & Pricing */}
                <div className="flex justify-between items-start w-full gap-3">
                  <Link href={`/collections/${product.slug}`} className="flex-1 pr-2">
                    <h3 className="text-[#1a1a1a] text-sm md:text-base font-medium leading-relaxed group-hover:text-[#888] transition-colors duration-300">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* --- PRICING WITH DISCOUNT --- */}
                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span className="text-[#1a1a1a] text-sm md:text-base font-medium whitespace-nowrap">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    
                    {product.compare_price && product.compare_price > product.price && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#888] line-through font-light text-[9px] md:text-[10px]">
                          Rs. {product.compare_price.toLocaleString()}
                        </span>
                        {product.discount && (
                          <span className="text-[#b33a3a] font-bold text-[9px] md:text-[10px] tracking-wider">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    )}

                    {product.sales_count > 0 && (
                      <span className="text-[9px] text-[#888] uppercase tracking-[0.1em] mt-1.5 font-medium whitespace-nowrap">
                        {product.sales_count} Sold
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Mobile Add to Cart */}
              <div className="md:hidden mt-5 w-full">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || "/Hero.png",
                    stock: product.stock, // 🌟 Must pass stock
                  }} 
                  variant="outline" 
                  className="w-full py-3 text-[10px] tracking-[0.2em] font-bold border-[#e5e5e5]" 
                  disabled={isOutOfStock} // 🌟 Disables button if limit is reached
                />
              </div>
              
            </div>
          );
        })}
      </div>

      {/* --- MOBILE ONLY CONTROLS --- */}
      <div className="flex flex-col items-center md:hidden px-6 gap-8 mt-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 flex items-center justify-center border border-[#e5e5e5] rounded-full active:bg-[#1a1a1a] active:text-[#fdfbfb] transition-all duration-300"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 flex items-center justify-center border border-[#e5e5e5] rounded-full active:bg-[#1a1a1a] active:text-[#fdfbfb] transition-all duration-300"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <Link href="/collections" className="w-full text-center border border-[#1a1a1a] text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-bold py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors">
          Explore Collection
        </Link>
      </div>

    </section>
  );
}