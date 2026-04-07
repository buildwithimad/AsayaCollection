'use client';

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../Ui/AddToCart";

export default function FeaturedProducts({ featuredProducts = [] }) {
  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[#fdfbfb]">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-4">
          Curated Selection
        </span>
        <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
          Featured Collection
        </h2>
        <p className="text-[#4a4a4a] text-sm md:text-base font-light tracking-wide max-w-lg leading-relaxed">
          Discover our most sought-after pieces, crafted with precision and designed to elevate your everyday aesthetic.
        </p>
      </div>

      {/* Product Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-14">
        {/* We slice to 4 just in case the DB returns more than a single row needs */}
        {featuredProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="group flex flex-col relative">
            
            {/* Main Link Wrapper for Image and Details via SLUG */}
            <Link href={`/collections/${product.slug}`} className="flex flex-col flex-1">
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] bg-[#faeceb]/50 mb-4 md:mb-6 overflow-hidden">
                <Image
                  src={product.images?.[0] || "/Hero.png"} // DB Image fallback
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Minimal Badges matching the main grid */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
                  {product.is_best_seller && (
                    <span className="bg-[#1a1a1a] text-[#fdfbfb] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                      Best Seller
                    </span>
                  )}
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
              <div className="flex flex-col items-center text-center mb-4 flex-1">
                <span className="text-[#888] text-[9px] md:text-[11px] uppercase tracking-[0.1em] mb-1 md:mb-2 font-medium">
                  {product.categories?.name || "Collection"}
                </span>
                <h3 className="text-[#1a1a1a] text-sm md:text-xl font-light tracking-wide mb-1 md:mb-2 transition-colors duration-300 group-hover:text-[#666]">
                  {product.name}
                </h3>
                <p className="text-[#4a4a4a] text-xs md:text-sm font-medium">
                  Rs. {product.price?.toLocaleString()}
                </p>
              </div>
            </Link>

            {/* --- Action Buttons (Positioned to avoid Link overlap) --- */}

            {/* Desktop Only: Glass Add to Cart on Hover */}
            <div className="absolute top-0 left-0 w-full aspect-[4/5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:flex items-end justify-center pb-8 z-20 pointer-events-none">
              {/* pointer-events-auto on the button itself allows click through the invisible parent */}
              <div className="pointer-events-auto">
                <AddToCartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || "/Hero.png",
                  }} 
                  variant="glass" 
                  fullWidth={false} 
                  className="px-10" 
                />
              </div>
            </div>

            {/* Mobile View: Visible Button below details */}
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

      {/* View All Button */}
      <div className="w-full flex justify-center mt-16 md:mt-24">
        <Link href="/collections" className="border-b border-[#1a1a1a] cursor-pointer pb-1 text-[#1a1a1a] text-[10px] md:text-sm uppercase tracking-[0.2em] font-medium transition-opacity hover:opacity-60">
          Shop All Collections
        </Link>
      </div>

    </section>
  );
}