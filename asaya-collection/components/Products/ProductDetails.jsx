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
  const [openSection, setOpenSection] = useState('description');

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
    <div className="min-h-screen bg-[#fdfbfb] pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- MAIN LAYOUT --- */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 lg:justify-center lg:items-start">
          
          {/* --- LEFT: DYNAMIC GALLERY --- */}
          <div className="w-full lg:w-[500px] xl:w-[600px] space-y-6 shrink-0">
            <div className="relative aspect-square bg-[#faeceb]/40 overflow-hidden shadow-inner border border-[#1a1a1a]/5">
              <Image 
                src={activeImg} 
                alt={product.name} 
                fill 
                priority
                className="object-cover transition-all duration-700" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImg(img)}
                    className={`relative aspect-square cursor-pointer overflow-hidden bg-[#faeceb]/40 border-b-2 transition-all 
                      ${activeImg === img ? 'border-[#1a1a1a]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: STICKY DETAILS --- */}
          <div className="w-full lg:max-w-[500px] lg:sticky lg:top-32 h-fit flex-1">
            <div className="flex flex-col gap-8">
              
              {/* Header & Badges */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#888] font-medium block">
                    {product.categories?.name || "Collection"}
                  </span>
                  
                  <div className="flex gap-2">
                    {product.is_best_seller && (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#1a1a1a] font-medium bg-[#1a1a1a]/5 px-2 py-1">
                        Best Seller
                      </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#b33a3a] font-medium bg-[#b33a3a]/10 px-2 py-1">
                        Low Stock ({product.stock} left)
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a] mb-3 leading-tight">
                  {product.name}
                </h1>
                
                {/* --- REVIEWS & RATING SUMMARY --- */}
                {reviewCount > 0 ? (
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'fill-[#1a1a1a]' : 'fill-[#1a1a1a]/15'}`} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <a href="#reviews" className="text-[10px] uppercase tracking-widest text-[#666] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] mt-0.5">
                      {averageRating} / 5 ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
                    </a>
                  </div>
                ) : (
                  <div className="mb-5">
                    <a href="#reviews" className="text-[10px] uppercase tracking-widest text-[#666] hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a]">
                      Be the first to review
                    </a>
                  </div>
                )}
                
                {/* Pricing & Discounts */}
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl font-medium text-[#1a1a1a]">
                    Rs. {product.price?.toLocaleString()}
                  </p>
                  {product.compare_price && product.compare_price > product.price && (
                    <p className="text-sm text-[#888] line-through font-light">
                      Rs. {product.compare_price.toLocaleString()}
                    </p>
                  )}
                  {product.discount > 0 && (
                    <span className="text-[10px] text-[#b33a3a] font-medium tracking-wider">
                      -{product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* ACCORDIONS */}
              <div className="border-t border-[#1a1a1a]/10">
                <div className="border-b border-[#1a1a1a]/10">
                  <button 
                    onClick={() => toggleSection('description')}
                    className="w-full py-5 flex justify-between items-center text-xs uppercase tracking-[0.15em] font-medium text-[#1a1a1a]"
                  >
                    Details & Care
                    <span className="text-lg font-light">{openSection === 'description' ? '−' : '+'}</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'description' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#4a4a4a] text-sm leading-relaxed font-light whitespace-pre-line mb-4">
                      {product.description}
                    </p>
                    {details.length > 0 && (
                      <ul className="space-y-2 text-xs text-[#666] font-light tracking-wide">
                        {details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1 h-1 mt-1.5 bg-[#1a1a1a]/20 rounded-full shrink-0"></span>
                            <span className="flex-1">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                {/* Shipping info */}
                <div className="border-b border-[#1a1a1a]/10">
                  <button 
                    onClick={() => toggleSection('shipping')}
                    className="w-full py-5 flex justify-between items-center text-xs uppercase tracking-[0.15em] font-medium text-[#1a1a1a]"
                  >
                    Shipping & Returns
                    <span className="text-lg font-light">{openSection === 'shipping' ? '−' : '+'}</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'shipping' ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#4a4a4a] text-sm leading-relaxed font-light mb-3">
                      Orders are dispatched within 24 hours. Nationwide delivery typically takes 3-5 business days. 
                    </p>
                    <p className="text-[#4a4a4a] text-sm leading-relaxed font-light">
                      We offer a 7-day return policy for unused items in their original packaging.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery info & Add to Cart */}
              <div className="pt-2 flex flex-col gap-4">
                <AddToCartButton product={cartPayload} variant="primary" />
                <p className="text-[10px] text-center mt-2 text-[#888] uppercase tracking-widest font-medium">
                  Nationwide Cash on Delivery Available
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* --- BOTTOM: REVIEWS COMPONENT --- */}
        <ProductReviews productId={product.id} initialReviews={reviews} />

      </div>
    </div>
  );
}