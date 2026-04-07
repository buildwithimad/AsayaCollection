'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // <-- Import useSearchParams
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '../Ui/AddToCart'; 

const SORT_OPTIONS = ["Newest Arrivals", "Price: Low to High", "Price: High to Low"];
const ITEMS_PER_PAGE = 12;

export default function Products({ products = [], categories = [] }) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category'); // Gets the '?category=...' from URL

  // Set initial category to the one in the URL if it exists, otherwise "All"
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "All");
  
  const [activeSort, setActiveSort] = useState("Newest Arrivals");
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category if the URL changes (e.g., clicking drawer link while already on this page)
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Generate the full list of categories with "All" at the top
  const categoryList = useMemo(() => {
    const categoryNames = categories.map(cat => cat.name);
    return ["All", ...categoryNames];
  }, [categories]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSort, showBestSellers, showTrending]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileFilterOpen]);

  // --- FILTERING & SORTING LOGIC (FRONTEND) ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (activeCategory !== "All") {
      result = result.filter((p) => p.categories?.name === activeCategory);
    }

    // 2. Best Seller Filter
    if (showBestSellers) {
      result = result.filter((p) => p.is_best_seller);
    }

    // 3. Trending Filter
    if (showTrending) {
      result = result.filter((p) => p.is_trending);
    }

    // 4. Sorting
    if (activeSort === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, activeSort, showBestSellers, showTrending]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-24 md:pt-32 pb-20 font-sans">
      
      {/* --- Page Header --- */}
      <div className="px-6 md:px-12 lg:px-16 mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
          <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-4 block">
            The Collection
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
            {activeCategory === "All" ? "All Pieces" : activeCategory}
          </h1>
        </div>
        <p className="text-[#666] text-sm font-light max-w-sm hidden md:block">
          Discover our complete range of meticulously crafted silhouettes, designed to elevate the everyday.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* --- DESKTOP SIDEBAR (FILTERS) --- */}
        <aside className="hidden lg:block w-1/4 max-w-[280px] shrink-0 sticky top-32 h-fit">
          
          {/* Featured Checkboxes */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 border-b border-[#1a1a1a]/10 pb-4">
              Featured
            </h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 group cursor-pointer text-sm font-light">
                <input 
                  type="checkbox" 
                  checked={showBestSellers} 
                  onChange={() => setShowBestSellers(!showBestSellers)}
                  className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                />
                <span className={showBestSellers ? "font-medium" : "text-[#666] group-hover:text-[#1a1a1a]"}>
                  Best Sellers
                </span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer text-sm font-light">
                <input 
                  type="checkbox" 
                  checked={showTrending} 
                  onChange={() => setShowTrending(!showTrending)}
                  className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                />
                <span className={showTrending ? "font-medium" : "text-[#666] group-hover:text-[#1a1a1a]"}>
                  Trending Now
                </span>
              </label>
            </div>
          </div>

          {/* REAL Categories */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 border-b border-[#1a1a1a]/10 pb-4">
              Categories
            </h3>
            <ul className="flex flex-col gap-4">
              {categoryList.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sm font-light tracking-wide cursor-pointer transition-colors duration-300 ${activeCategory === cat ? 'text-[#1a1a1a] font-medium underline underline-offset-4' : 'text-[#666] hover:text-[#1a1a1a]'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 border-b border-[#1a1a1a]/10 pb-4">
              Sort By
            </h3>
            <ul className="flex flex-col gap-4">
              {SORT_OPTIONS.map(opt => (
                <li key={opt}>
                  <button 
                    onClick={() => setActiveSort(opt)}
                    className={`text-sm font-light tracking-wide cursor-pointer transition-colors duration-300 ${activeSort === opt ? 'text-[#1a1a1a] font-medium underline underline-offset-4' : 'text-[#666] hover:text-[#1a1a1a]'}`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* --- MAIN PRODUCT GRID AREA --- */}
        <div className="w-full lg:w-3/4 flex flex-col">
          
          {/* Top Bar (Mobile Filter Trigger & Result Count) */}
          <div className="flex justify-between items-center mb-8 border-b border-[#1a1a1a]/10 pb-4 lg:border-none lg:pb-0">
            <button 
              onClick={() => setIsMobileFilterOpen(true)} 
              className="lg:hidden flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>
              Filter & Sort
            </button>
            <span className="text-[10px] text-[#666] uppercase tracking-widest ml-auto">
              {filteredAndSortedProducts.length} Results
            </span>
          </div>

          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {currentProducts.map((product) => (
                <div key={product.id} className="group relative flex flex-col">
                  
                  {/* Visual Content wrapped in a link to Product Details page via SLUG */}
                  <Link href={`/collections/${product.slug}`} className="flex flex-col flex-1">
                    <div className="relative w-full aspect-[4/5] bg-[#faeceb]/40 mb-4 overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/Hero.png"} 
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                      />

                      {/* --- UPDATED MINIMAL STATUS BADGES --- */}
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
                        {product.is_best_seller && (
                          // Solid charcoal best seller, smaller text
                          <span className="bg-[#1a1a1a] text-[#fdfbfb] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                            Best Seller
                          </span>
                        )}
                        {product.is_trending && (
                          // Glass style trending, smaller text
                          <span className="bg-[#fdfbfb]/80 backdrop-blur-sm text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                            Trending
                          </span>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          // Pale pink background almost sold out, smaller text
                          <span className="bg-[#faeceb] text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">
                            Almost Sold Out
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center flex-1 mb-4 p-1">
                      <span className="text-[#888] text-[9px] md:text-[10px] uppercase tracking-[0.15em] mb-1 md:mb-1.5 font-medium">
                        {product.categories?.name || "Collection"}
                      </span>
                      <h3 className="text-[#1a1a1a] text-sm md:text-base font-light tracking-wide mb-1 md:mb-1.5 transition-colors duration-300 group-hover:text-[#666]">
                        {product.name}
                      </h3>
                      <p className="text-[#4a4a4a] text-xs md:text-sm font-medium">
                        Rs. {product.price?.toLocaleString()}
                      </p>
                    </div>
                  </Link>

                  {/* Desktop Quick Add (Hover only) */}
                  <div className="absolute inset-x-0 bottom-[88px] md:bottom-[96px] p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20 hidden lg:block pointer-events-none">
                    <div className="pointer-events-auto">
                      <AddToCartButton 
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images?.[0] || "/Hero.png",
                        }} 
                        variant="glass" 
                        fullWidth={true} 
                      />
                    </div>
                  </div>

                  {/* Mobile Add to Cart (Visible below text) */}
                  <div className="lg:hidden mt-auto relative z-20">
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
          ) : (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center">
              <span className="text-[#666] font-light text-lg tracking-wide mb-4">No pieces found.</span>
              <button 
                onClick={() => {
                  setActiveCategory("All");
                  setShowBestSellers(false);
                  setShowTrending(false);
                }}
                className="border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-xs uppercase tracking-[0.2em] font-medium hover:opacity-60 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* --- ACCURATE PAGINATION --- */}
          {totalPages > 1 && (
            <div className="mt-20 border-t border-[#1a1a1a]/10 pt-10 flex justify-center items-center gap-6">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-20 hover:opacity-60 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    onClick={() => setCurrentPage(page)} 
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs transition-all duration-300 ${
                      currentPage === page 
                      ? 'bg-[#1a1a1a] text-white font-medium' 
                      : 'text-[#666] hover:bg-[#faeceb] font-light cursor-pointer'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-20 hover:opacity-60 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>

      {/* --- MOBILE FULL-SCREEN FILTER OVERLAY --- */}
      <div className={`fixed inset-0 z-50 bg-[#fdfbfb] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ${isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col h-full">
          
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#1a1a1a]/10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Filter & Sort</span>
            <button onClick={() => setIsMobileFilterOpen(false)} className="text-xs uppercase tracking-[0.2em] cursor-pointer font-bold underline">
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            
            <div className="mb-10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-6">Featured</h3>
              <div className="flex flex-col gap-6">
                <label className="flex items-center gap-4 text-lg font-light">
                  <input type="checkbox" checked={showBestSellers} onChange={() => setShowBestSellers(!showBestSellers)} className="w-6 h-6 accent-[#1a1a1a]" />
                  Best Sellers
                </label>
                <label className="flex items-center gap-4 text-lg font-light">
                  <input type="checkbox" checked={showTrending} onChange={() => setShowTrending(!showTrending)} className="w-6 h-6 accent-[#1a1a1a]" />
                  Trending Now
                </label>
              </div>
            </div>

            {/* REAL Categories Mobile */}
            <div className="mb-10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-6">Categories</h3>
              <div className="flex flex-col gap-5">
                {categoryList.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)} 
                    className={`text-left text-2xl cursor-pointer font-light tracking-wide ${activeCategory === cat ? 'text-[#1a1a1a] font-medium underline underline-offset-4' : 'text-[#666]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-6">Sort By</h3>
              <div className="flex flex-col gap-5">
                {SORT_OPTIONS.map(opt => (
                  <button 
                    key={opt} 
                    onClick={() => setActiveSort(opt)} 
                    className={`text-left text-xl font-light tracking-wide ${activeSort === opt ? 'text-[#1a1a1a] font-medium underline underline-offset-4' : 'text-[#666]'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-[#1a1a1a]/10 bg-[#fdfbfb]">
            <button 
              onClick={() => setIsMobileFilterOpen(false)} 
              className="w-full bg-[#1a1a1a] text-white py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#333] transition-colors"
            >
              Show {filteredAndSortedProducts.length} Results
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}