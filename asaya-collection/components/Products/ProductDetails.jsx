'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AddToCartButton from '@/components/Ui/AddToCart';
import ProductReviews from './Reviews'; // Adjust this import path as needed!

export default function ProductDetails({ product }) {
  // Safe fallbacks
  const images = product?.images?.length ? product.images : ["/Hero.png"];
  const details = product?.details?.length ? product.details : [];
  const reviews = product?.reviews?.length ? product.reviews : [];

  // --- CALCULATE REVIEWS ---
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1) 
    : 0;

  const [activeImg, setActiveImg] = useState(images[0]);
  const [openSection, setOpenSection] = useState(null); // Accordions closed by default for a cleaner look

  // Update active image if the product prop changes
  useEffect(() => {
    if (images.length > 0) setActiveImg(images[0]);
  }, [product]);

  if (!product) return null;

  // Format payload for Zustand cart
  const cartPayload = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: images[0],
    color: "Standard", 
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[#fdfbfb] pt-32 pb-20 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- MAIN LAYOUT --- */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 lg:justify-center lg:items-start mb-24">
          
          {/* --- LEFT: DYNAMIC GALLERY --- */}
          <div className="w-full lg:w-[500px] xl:w-[600px] space-y-4 shrink-0">
            <div className="relative aspect-[4/5] bg-[#faeceb]/40 overflow-hidden shadow-inner">
              <Image 
                src={activeImg} 
                alt={product.name} 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImg(img)}
                    className={`relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#faeceb]/40 transition-all duration-300
                      ${activeImg === img ? 'opacity-100 ring-1 ring-[#1a1a1a] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: STICKY DETAILS --- */}
          <div className="w-full lg:max-w-[480px] lg:sticky lg:top-32 h-fit flex-1">
            <div className="flex flex-col">
              
              {/* STATUS BADGES */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.is_best_seller && (
                  <span className="bg-[#1a1a1a] text-[#fdfbfb] px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-medium">
                    Best Seller
                  </span>
                )}
                {product.is_trending && (
                  <span className="bg-[#faeceb] text-[#1a1a1a] px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-medium">
                    Trending
                  </span>
                )}
              </div>

              {/* BRAND / CATEGORY */}
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#888] font-medium block mb-2">
                {product.categories?.name || "The Collection"}
              </span>

              {/* TITLE */}
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a] mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* --- REVIEW STARS & COUNT --- */}
              {reviewCount > 0 ? (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'fill-[#ebb626]' : 'fill-[#1a1a1a]/15'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <a href="#reviews" className="text-[10px] uppercase tracking-widest text-[#888] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] mt-0.5">
                    {averageRating} / 5 ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
                  </a>
                </div>
              ) : (
                <div className="mb-6">
                  <a href="#reviews" className="text-[10px] uppercase tracking-widest text-[#888] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a]">
                    Be the first to review
                  </a>
                </div>
              )}
              
              {/* --- UPDATED PRICING, DISCOUNT & STOCK --- */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl md:text-3xl font-normal text-[#1a1a1a]">
                    Rs. {product.price?.toLocaleString()}
                  </p>
                  
                  {product.compare_price && product.compare_price > product.price && (
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-[#888] line-through font-light">
                        Rs. {product.compare_price.toLocaleString()}
                      </p>
                      {/* 🌟 USES DB DISCOUNT FIELD */}
                      {product.discount && (
                        <span className="bg-[#b33a3a]/5 border border-[#b33a3a]/20 text-[#b33a3a] px-2 py-1 text-[9px] uppercase tracking-[0.2em] font-bold">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dynamic Stock Urgency */}
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-xs text-[#b33a3a] font-medium tracking-wide mt-1">
                    {product.stock === 1 
                      ? "Last piece left in stock!" 
                      : `Only ${product.stock} pieces left in stock!`}
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-xs text-[#888] font-medium tracking-wide uppercase mt-1">
                    Currently Out of Stock
                  </span>
                )}
              </div>

              {/* --- EDITORIAL DESCRIPTION --- */}
              <p className="text-[#666] text-sm leading-[1.8] font-light whitespace-pre-line mb-10">
                {product.description}
              </p>

              {/* --- DELIVERY & ADD TO CART --- */}
              <div className="flex flex-col gap-4 mb-12">
                <AddToCartButton product={cartPayload} variant="primary" disabled={product.stock === 0} />
                <div className="flex items-center justify-center gap-2 text-[#888]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  <p className="text-[9px] uppercase tracking-widest font-medium">
                    Nationwide Cash on Delivery Available
                  </p>
                </div>
              </div>

              {/* --- ACCORDIONS --- */}
              <div className="border-t border-[#1a1a1a]/10">
                
                {/* Details & Features */}
                <div className="border-b border-[#1a1a1a]/10">
                  <button 
                    onClick={() => toggleSection('details')}
                    className="w-full py-5 flex justify-between items-center text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a1a] cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    Details & Features
                    <span className="text-lg font-light leading-none">{openSection === 'details' ? '−' : '+'}</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'details' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {details.length > 0 ? (
                      <ul className="space-y-3 text-sm text-[#666] font-light">
                        {details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 mt-2 bg-[#1a1a1a]/20 rounded-full shrink-0"></span>
                            <span className="flex-1 leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#666] font-light italic">No additional details available.</p>
                    )}
                  </div>
                </div>
                
                {/* Shipping info */}
                <div className="border-b border-[#1a1a1a]/10">
                  <button 
                    onClick={() => toggleSection('shipping')}
                    className="w-full py-5 flex justify-between items-center text-[11px] uppercase tracking-[0.15em] font-medium text-[#1a1a1a] cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    Shipping & Returns
                    <span className="text-lg font-light leading-none">{openSection === 'shipping' ? '−' : '+'}</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'shipping' ? 'max-h-[300px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#666] text-sm leading-relaxed font-light mb-3">
                      Orders are processed and dispatched within 24 hours. Nationwide delivery typically takes 3-5 business days. 
                    </p>
                    <p className="text-[#666] text-sm leading-relaxed font-light">
                      We offer a 7-day return policy for unused items in their original packaging, ensuring a seamless luxury experience.
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM: REVIEWS COMPONENT --- */}
        <div id="reviews">
          <ProductReviews productId={product.id} initialReviews={reviews} />
        </div>

      </div>
    </div>
  );
}