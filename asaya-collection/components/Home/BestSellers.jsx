'use client';

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../Ui/AddToCart";

export default function BestSellers({ bestSellers = [] }) {
  if (!bestSellers || bestSellers.length === 0) return null;

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[#fdfbfb]">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
        <div className="max-w-xl">
          <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-4 block">
            The Signatures
          </span>
          <h2 className="text-[#1a1a1a] text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            Our Best Sellers
          </h2>
          <p className="text-[#666] text-sm font-light leading-relaxed">
            The pieces our community returns to time and time again. Discover the undisputed icons of the Asaya collection.
          </p>
        </div>
        
        <Link 
          href="/collections" 
          className="hidden md:inline-flex border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-xs uppercase tracking-[0.2em] font-medium hover:opacity-60 transition-opacity"
        >
           Shop All Collections
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-10">
        {/* Slice to 4 just to ensure it fits the design block perfectly */}
        {bestSellers.slice(0, 4).map((item) => (
          <div key={item.id} className="group flex flex-col relative">
            
            {/* Wrap image and details in a Link to the product details page via SLUG */}
            <Link href={`/collections/${item.slug}`} className="flex flex-col flex-1">
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] bg-[#faeceb]/40 mb-4 md:mb-6 overflow-hidden">
                <Image
                  src={item.images?.[0] || "/Hero.png"} // DB fallback
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/5 transition-colors duration-700"></div>

                {/* --- UPDATED MINIMAL STATUS BADGES --- */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
                  {/* Since this is the Best Sellers section, we assume this is true, but check anyway */}
                  {(item.is_best_seller !== false) && (
                    <span className="bg-[#1a1a1a] text-[#fdfbfb] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Best Seller
                    </span>
                  )}
                  {item.is_trending && (
                    <span className="bg-[#fdfbfb]/80 backdrop-blur-sm text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Trending
                    </span>
                  )}
                  {item.stock <= 5 && item.stock > 0 && (
                    <span className="bg-[#faeceb] text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Almost Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details from DB */}
              <div className="flex flex-col items-center text-center mb-4 flex-1">
                <span className="text-[#888] text-[9px] md:text-[10px] uppercase tracking-[0.15em] mb-1 md:mb-2 font-medium">
                  {item.categories?.name || "Collection"}
                </span>
                <h3 className="text-[#1a1a1a] text-sm md:text-lg font-light tracking-wide mb-1 md:mb-2 transition-colors duration-300 group-hover:text-[#666]">
                  {item.name}
                </h3>
                <p className="text-[#1a1a1a] text-xs md:text-sm font-medium">
                  Rs. {item.price?.toLocaleString()}
                </p>
              </div>
            </Link>

            {/* --- Buttons (Kept separate from the card link for functionality) --- */}
            
            {/* Desktop Quick Add (Hover only) */}
            <div className="absolute inset-x-0 bottom-[100px] md:bottom-[108px] p-5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 hidden md:block pointer-events-none">
              <div className="pointer-events-auto">
                <AddToCartButton 
                  product={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.images?.[0] || "/Hero.png",
                  }} 
                  variant="glass" 
                />
              </div>
            </div>

            {/* Mobile Add to Cart */}
            <div className="md:hidden mt-auto relative z-20">
              <AddToCartButton 
                product={{
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.images?.[0] || "/Hero.png",
                }} 
                variant="outline" 
                className="py-3 text-[9px] tracking-[0.15em]" 
              />
            </div>
            
          </div>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-16 flex justify-center md:hidden">
        <Link 
          href="/collections" 
          className="border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-medium"
        >
          Shop All Collections
        </Link>
      </div>

    </section>
  );
}