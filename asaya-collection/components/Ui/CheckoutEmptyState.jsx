'use client';

import Link from 'next/link';

export default function CheckoutEmptyState() {
  return (
    <div className="min-h-[80vh] bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-20 font-sans flex flex-col items-center justify-center px-6">
      
      {/* Delicate Shopping Bag Icon */}
      <div className="w-20 h-20 mb-8 rounded-full bg-[#faeceb]/40 flex items-center justify-center border border-[#1a1a1a]/5">
        <svg className="w-8 h-8 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="0.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-4 block">
        Your Bag is Empty
      </span>
      
      <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-6 text-center max-w-lg">
        Nothing to checkout yet.
      </h1>
      
      <p className="text-[#666] text-sm font-light leading-relaxed max-w-md text-center mb-12">
        Discover our latest collections and find your new signature piece to elevate your everyday aesthetic.
      </p>

      <Link 
        href="/collections" 
        className="bg-[#1a1a1a] text-[#fdfbfb] px-10 py-5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#333] transition-colors"
      >
        Explore Collections
      </Link>

    </div>
  );
}