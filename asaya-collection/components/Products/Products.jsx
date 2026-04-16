'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '../Ui/AddToCart'; 
import { getFilteredProductsAction } from '@/app/actions/productServices';
import { useCartStore } from '@/store/cartStore'; // 🌟 1. Import Cart Store

const SORT_OPTIONS = ["Newest Arrivals", "Price: Low to High", "Price: High to Low"];
const ITEMS_PER_PAGE = 12;

export default function Products({ initialProducts = [], categories = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const pathname = usePathname();
  const categoryFromUrl = searchParams.get('category'); 

  // 🌟 2. Fetch the cart at the top level
  const cart = useCartStore((state) => state.cart || []);

  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "All");
  const [activeSort, setActiveSort] = useState("Newest Arrivals");
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [navigatingId, setNavigatingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset navigating state if user uses the browser "Back" button
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) setNavigatingId(null);
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    
    const params = new URLSearchParams(searchParams);
    
    if (cat === "All") {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (categoryFromUrl) setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    if (isMobileFilterOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileFilterOpen]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filteredData = await getFilteredProductsAction({
        category: activeCategory,
        sort: activeSort,
        bestSeller: showBestSellers,
        trending: showTrending
      });
      
      setProducts(filteredData);
      setCurrentPage(1); 
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSort, showBestSellers, showTrending]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoryList = ["All", ...categories.map(cat => cat.name)];

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice(
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight capitalize">
            {activeCategory === "All" ? "All Pieces" : activeCategory.replace(/-/g, ' ')}
          </h1>
        </div>
        <p className="text-[#666] text-sm font-light max-w-sm hidden md:block">
          Discover our complete range of meticulously crafted silhouettes, designed to elevate the everyday.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:block w-1/4 max-w-[280px] shrink-0 sticky top-32 h-fit">
          
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 border-b border-[#1a1a1a]/10 pb-4">Featured</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 group cursor-pointer text-sm font-light">
                <input type="checkbox" checked={showBestSellers} onChange={() => setShowBestSellers(!showBestSellers)} className="w-4 h-4 accent-[#1a1a1a] cursor-pointer" />
                <span className={showBestSellers ? "font-medium" : "text-[#666] group-hover:text-[#1a1a1a]"}>Best Sellers</span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer text-sm font-light">
                <input type="checkbox" checked={showTrending} onChange={() => setShowTrending(!showTrending)} className="w-4 h-4 accent-[#1a1a1a] cursor-pointer" />
                <span className={showTrending ? "font-medium" : "text-[#666] group-hover:text-[#1a1a1a]"}>Trending Now</span>
              </label>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 border-b border-[#1a1a1a]/10 pb-4">Categories</h3>
            <ul className="flex flex-col gap-4">
              {categoryList.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-sm font-light tracking-wide cursor-pointer transition-colors duration-300 capitalize ${activeCategory === cat ? 'text-[#1a1a1a] font-medium underline underline-offset-4' : 'text-[#666] hover:text-[#1a1a1a]'}`}
                  >
                    {cat.replace(/-/g, ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 border-b border-[#1a1a1a]/10 pb-4">Sort By</h3>
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

        {/* --- MAIN PRODUCT GRID --- */}
        <div className="w-full lg:w-3/4 flex flex-col relative min-h-[50vh]">
          
          <div className="flex justify-between items-center mb-8 border-b border-[#1a1a1a]/10 pb-4 lg:border-none lg:pb-0">
            <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/></svg>
              Filter & Sort
            </button>
            <span className="text-[10px] text-[#666] uppercase tracking-widest ml-auto">
              {products.length} Results
            </span>
          </div>

          {loading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#fdfbfb]/60 backdrop-blur-[2px] pt-20">
              <div className="w-8 h-8 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin"></div>
            </div>
          )}

          <div className={`transition-opacity duration-300 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                {currentProducts.map((product) => {
                  
                  const reviews = product.reviews || [];
                  const reviewCount = reviews.length;
                  const avgRating = reviewCount > 0 
                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1) 
                    : 0;

                  // 🌟 3. CALCULATE OUT OF STOCK STATUS
                  const cartItem = cart.find(item => item.id === product.id);
                  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
                  const isOutOfStock = product.stock === 0 || currentQuantityInCart >= product.stock;

                  return (
                    <div key={product.id} className="group relative flex flex-col h-full animate-in fade-in duration-500">
                      
                      <div className="relative w-full aspect-[4/5] bg-[#faeceb]/40 mb-4 overflow-hidden">
                       <Link 
                          href={`/collections/${product.slug || product.id}`} 
                          onClick={() => setNavigatingId(product.id)}
                          className="absolute inset-0 z-0"
                        >
                          <Image
                            src={product.images?.[0] || "/Hero.png"} 
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover object-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                          />
                          
                          {navigatingId === product.id && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#fdfbfb]/50 backdrop-blur-[2px]">
                              <div className="w-8 h-8 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin"></div>
                            </div>
                          )}
                        </Link>

                        {/* 🌟 4. STATUS BADGES W/ OUT OF STOCK */}
                        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
                          {product.stock === 0 ? (
                            <span className="bg-white/90 backdrop-blur-md text-[#b33a3a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-bold border border-[#1a1a1a]/10 shadow-sm">
                              Out of Stock
                            </span>
                          ) : (
                            <>
                              {product.is_best_seller && (
                                <span className="bg-[#1a1a1a] text-[#fdfbfb] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">Best Seller</span>
                              )}
                              {product.is_trending && (
                                <span className="bg-[#fdfbfb]/80 backdrop-blur-sm text-[#1a1a1a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-medium border border-[#1a1a1a]/10">Trending</span>
                              )}
                              {product.stock <= 5 && product.stock > 0 && (
                                <span className="bg-[#faeceb] text-[#b33a3a] px-2 py-0.5 text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-bold border border-[#1a1a1a]/10">Only {product.stock} Left</span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Desktop Quick Add */}
                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20 hidden lg:block pointer-events-none">
                          <div className="pointer-events-auto">
                            <AddToCartButton 
                              product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images?.[0] || "/Hero.png",
                                stock: product.stock // 🌟 Send stock
                              }} 
                              variant="glass" 
                              fullWidth={true} 
                              disabled={isOutOfStock} // 🌟 Disable button
                            />
                          </div>
                        </div>
                      </div>

                      <Link href={`/collections/${product.slug || product.id}`}
                      onClick={() => setNavigatingId(product.id)}
                       className="flex flex-col items-center text-center flex-1 p-1">
                        <span className="text-[#888] text-[9px] md:text-[10px] uppercase tracking-[0.15em] mb-1 font-medium capitalize">
                          {product.categories?.name?.replace(/-/g, ' ') || "Collection"}
                        </span>
                        
                        <h3 className="text-[#1a1a1a] text-sm md:text-base font-light tracking-wide mb-1.5 transition-colors duration-300 group-hover:text-[#666]">
                          {product.name}
                        </h3>

                        {reviewCount > 0 && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-2.5 h-2.5 ${i < Math.round(avgRating) ? 'fill-[#ebb626]' : 'fill-[#1a1a1a]/15'}`} viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[9px] text-[#888]">({reviewCount})</span>
                          </div>
                        )}

                        {/* 🌟 5. UPDATE PRICING CONTAINER TO PUSH BOTTOM */}
                        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium mt-auto pb-1">
                          <span className="text-[#1a1a1a]">Rs. {product.price?.toLocaleString()}</span>
                          {product.compare_price && product.compare_price > product.price && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#888] line-through font-light text-[10px] md:text-xs">
                                Rs. {product.compare_price.toLocaleString()}
                              </span>
                              {product.discount && (
                                <span className="text-[#b33a3a] font-bold text-[9px] md:text-[10px] tracking-wider">
                                  -{product.discount}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Mobile Add to Cart */}
                      <div className="lg:hidden mt-3 relative z-20">
                        <AddToCartButton 
                          product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images?.[0] || "/Hero.png",
                            stock: product.stock // 🌟 Send stock
                          }} 
                          variant="outline" 
                          className="py-3 text-[9px] tracking-[0.15em]" 
                          disabled={isOutOfStock} // 🌟 Disable button
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full py-32 flex flex-col items-center justify-center text-center">
                <span className="text-[#666] font-light text-lg tracking-wide mb-4">No pieces found.</span>
                <button 
                  onClick={() => {
                    handleCategoryChange("All");
                    setShowBestSellers(false);
                    setShowTrending(false);
                  }}
                  className="border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-xs uppercase tracking-[0.2em] font-medium hover:opacity-60 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* --- PAGINATION --- */}
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
      </div>

      {/* --- MOBILE FILTER OVERLAY --- */}
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

            <div className="mb-10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-6">Categories</h3>
              <div className="flex flex-col gap-5">
                {categoryList.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => handleCategoryChange(cat)} 
                    className={`text-left text-2xl cursor-pointer font-light tracking-wide capitalize ${activeCategory === cat ? 'text-[#1a1a1a] font-medium underline underline-offset-4' : 'text-[#666]'}`}
                  >
                    {cat.replace(/-/g, ' ')}
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
              Show {products.length} Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}