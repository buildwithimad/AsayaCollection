'use client';

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../Ui/AddToCart";

export default function FeaturedProducts({ featuredProducts = [] }) {
  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[#fdfbfb]">
      
      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <span className="uppercase tracking-[0.4em] text-[#888] text-[9px] md:text-[10px] font-bold mb-4 block">
          Curated Selection
        </span>
        <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
          Featured Collection
        </h2>
        <p className="text-[#4a4a4a] text-sm md:text-base font-light tracking-wide max-w-lg leading-relaxed">
          Discover our most sought-after pieces, crafted with precision and designed to elevate your everyday aesthetic.
        </p>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
        {featuredProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="group flex flex-col relative w-full">
            
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] bg-[#faf9f8] mb-4 md:mb-5 overflow-hidden">
              <Link href={`/collections/${product.slug}`} className="absolute inset-0 z-0">
                <Image
                  src={product.images?.[0] || "/Hero.png"} 
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
              </Link>

              {/* Badges */}
              <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1 md:gap-1.5 items-start pointer-events-none">
                {product.is_best_seller && (
                  <span className="bg-[#1a1a1a] text-white px-2 py-0.5 md:px-2.5 md:py-1 text-[6px] md:text-[8px] uppercase tracking-[0.25em] font-bold shadow-sm">
                    Best Seller
                  </span>
                )}
                {product.is_trending && (
                  <span className="bg-white/90 backdrop-blur-md text-[#1a1a1a] px-2 py-0.5 md:px-2.5 md:py-1 text-[6px] md:text-[8px] uppercase tracking-[0.25em] font-bold shadow-sm">
                    Trending
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="bg-[#faeceb] text-[#b33a3a] px-2 py-0.5 md:px-2.5 md:py-1 text-[6px] md:text-[8px] uppercase tracking-[0.25em] font-bold shadow-sm">
                    Only {product.stock} Left
                  </span>
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
                  }} 
                  variant="glass" 
                />
              </div>
            </div>

            {/* --- E-COMMERCE STRUCTURED TEXT BLOCK --- */}
            <div className="flex flex-col w-full flex-1">
              
              {/* Row 1: Category & Ratings */}
              <div className="flex justify-between items-center w-full mb-1.5 md:mb-2">
                <span className="text-[#888] text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold truncate pr-2">
                  {product.categories?.name || "Collection"}
                </span>
                
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-2 h-2 md:w-2.5 md:h-2.5 ${i < Math.round(product.rating || 0) ? 'fill-[#ebb626]' : 'fill-[#e5e5e5]'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[7px] md:text-[9px] text-[#aaa] font-medium tracking-widest mt-0.5">({product.reviews_count || 0})</span>
                </div>
              </div>

              {/* Row 2: Product Title & Pricing */}
              <div className="flex justify-between items-start w-full gap-2 md:gap-3">
                <Link href={`/collections/${product.slug}`} className="flex-1 pr-1 md:pr-2">
                  <h3 className="text-[#1a1a1a] text-xs sm:text-sm md:text-base font-medium leading-relaxed group-hover:text-[#888] transition-colors duration-300 line-clamp-2 md:line-clamp-none">
                    {product.name}
                  </h3>
                </Link>
                
                {/* --- PRICING WITH DISCOUNT --- */}
                <div className="flex flex-col items-end shrink-0 text-right">
                  <span className="text-[#1a1a1a] text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  
                  {product.compare_price && product.compare_price > product.price && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[#888] line-through font-light text-[8px] md:text-[10px]">
                        Rs. {product.compare_price.toLocaleString()}
                      </span>
                      {product.discount && (
                        <span className="text-[#b33a3a] font-bold text-[8px] md:text-[9px] tracking-wider">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  )}

                  {product.sales_count > 0 && (
                    <span className="text-[7px] md:text-[9px] text-[#888] uppercase tracking-[0.1em] mt-1.5 font-medium whitespace-nowrap">
                      {product.sales_count} Sold
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Slimmer Mobile Add to Cart */}
            <div className="md:hidden mt-3 w-full">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0] || "/Hero.png",
                }} 
                variant="outline" 
                className="w-full py-2.5 text-[8px] tracking-[0.15em] font-bold border-[#e5e5e5]" 
              />
            </div>
            
          </div>
        ))}
      </div>

      {/* --- VIEW ALL BUTTON --- */}
      <div className="w-full flex justify-center mt-12 md:mt-24">
        <Link href="/collections" className="group flex items-center gap-3 text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-bold">
          <span className="pb-1 border-b border-[#1a1a1a] group-hover:opacity-60 transition-opacity">
            Shop All Collections
          </span>
        </Link>
      </div>

    </section>
  );
}