'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    // Updated background to established soft pink, setting base text to charcoal
    <footer className="w-full bg-[#fdfbfb]/90 backdrop-blur-md text-[#1a1a1a] pt-20 md:pt-32 pb-10 px-6 md:px-12 lg:px-24">
      
      {/* Top Section: Newsletter & Brand Identity */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-20 md:mb-32 gap-16 lg:gap-8">
        
        {/* Brand / Manifesto */}
        <div className="w-full lg:w-1/3">
          {/* Logo updated to charcoal */}
          <Link href="/" className="text-[#1a1a1a] text-4xl md:text-5xl font-light tracking-wide block mb-6 hover:opacity-70 transition-opacity">
            Asaya
          </Link>
          {/* Description updated to soft gray */}
          <p className="text-[#4a4a4a] text-sm font-light tracking-wide leading-relaxed max-w-sm">
            Redefining modern elegance through timeless silhouettes and conscious craftsmanship. Designed for the everyday muse.
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="w-full lg:w-1/2 lg:pl-16">
          {/* Label updated to soft gray */}
          <span className="uppercase tracking-[0.2em] text-[#666] text-[10px] sm:text-xs font-medium mb-4 block">
            Join The Inner Circle
          </span>
          {/* Heading updated to charcoal */}
          <h3 className="text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight mb-8 max-w-lg">
            Exclusive access to new collections and private events.
          </h3>
          
          <form className="relative flex items-center w-full max-w-md group" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your Email Address" 
              required
              // Updated input colors, borders, and placeholder
              className="w-full bg-transparent border-b border-[#1a1a1a]/20 pb-3 text-sm font-light text-[#1a1a1a] placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
            />
            <button 
              type="submit"
              // Updated button color
              className="absolute right-0 bottom-3 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1a1a1a] hover:opacity-60 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
        
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-20 md:mb-32">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          {/* Column Title updated to gray */}
          <span className="uppercase tracking-[0.2em] text-[#666] text-[10px] font-medium mb-2">Shop</span>
          {/* Links updated to gray with charcoal hover */}
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">All Collections</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">The Totes</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Crossbody</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Evening Bags</Link>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <span className="uppercase tracking-[0.2em] text-[#666] text-[10px] font-medium mb-2">About</span>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Our Story</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Craftsmanship</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Sustainability</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Journal</Link>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <span className="uppercase tracking-[0.2em] text-[#666] text-[10px] font-medium mb-2">Support</span>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Contact Us</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">FAQ</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Shipping & Returns</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Track Order</Link>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-4">
          <span className="uppercase tracking-[0.2em] text-[#666] text-[10px] font-medium mb-2">Social</span>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Instagram</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">TikTok</Link>
          <Link href="#" className="text-[#4a4a4a] text-sm font-light hover:text-[#1a1a1a] transition-colors">Pinterest</Link>
        </div>

      </div>

      {/* Bottom Section: Copyright & Legal */}
      {/* Updated border color */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#1a1a1a]/10 pt-8 gap-4">
        {/* Updated text color */}
        <p className="text-[#888] text-[10px] uppercase tracking-[0.1em]">
          © {new Date().getFullYear()} Asaya Official. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-[#888] text-[10px] uppercase tracking-[0.1em]">
          {/* Updated hover colors */}
          <Link href="#" className="hover:text-[#1a1a1a] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#1a1a1a] transition-colors">Terms of Service</Link>
        </div>
      </div>

    </footer>
  );
}