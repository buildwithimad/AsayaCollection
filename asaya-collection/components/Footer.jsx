'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa6'; // 🌟 Imported React Icons

export default function Footer() {
  return (
    <footer className="w-full bg-[#fdfbfb] text-[#1a1a1a] pt-24 md:pt-32 pb-10 px-6 md:px-12 lg:px-24 border-t border-[#1a1a1a]/5">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 mb-24 md:mb-32">
          
          {/* Brand Manifesto & BIG LOGO */}
          <div className="w-full lg:w-1/3 flex flex-col items-start">
            <Link href="/" className="mb-8 hover:opacity-70 transition-opacity inline-block">
              <Image 
                src="/Logo.png" 
                alt="Asaya Official Logo" 
                width={250} 
                height={80} 
                className="w-auto h-12 md:h-16 lg:h-20 object-contain object-left" 
                priority={false}
              />
            </Link>
            <p className="text-[#666] text-xs md:text-sm font-light tracking-wide leading-relaxed max-w-[320px]">
              Redefining modern elegance through timeless silhouettes and conscious craftsmanship. Designed for the everyday muse.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
            
            {/* Column 1: Boutique */}
            <div className="flex flex-col gap-5">
              <span className="uppercase tracking-[0.2em] text-[#1a1a1a] text-[10px] font-bold mb-2">Boutique</span>
              <Link href="/collections" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">All Collections</Link>
              <Link href="/collections?category=New-Arrivals" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">New Arrivals</Link>
              <Link href="/collections?category=The-Totes" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">The Totes</Link>
              <Link href="/collections?category=Evening-Bags" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">Evening Bags</Link>
            </div>

            {/* Column 2: Client Services */}
            <div className="flex flex-col gap-5">
              <span className="uppercase tracking-[0.2em] text-[#1a1a1a] text-[10px] font-bold mb-2">Client Services</span>
              <Link href="/contact" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">Contact Us</Link>
              <Link href="/care-guide" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">Care Guide</Link>
              <Link href="/faq" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">FAQ</Link>
              <Link href="/about" className="text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors">Our Story</Link>
            </div>

            {/* Column 3: Socials with React Icons */}
            <div className="flex flex-col gap-5">
              <span className="uppercase tracking-[0.2em] text-[#1a1a1a] text-[10px] font-bold mb-2">Socials</span>
              
              {/* Instagram */}
              <a href="https://www.instagram.com/asaya_collection/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors mt-2 group">
                <FaInstagram className="w-[18px] h-[18px] opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Instagram</span>
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@asaya_collection" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors group">
                <FaTiktok className="w-[18px] h-[18px] opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>TikTok</span>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61581194505968" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#666] text-sm font-light hover:text-[#1a1a1a] transition-colors group">
                <FaFacebookF className="w-[18px] h-[18px] opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Facebook</span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-t border-[#1a1a1a]/10 pt-8 gap-6">
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 text-[#888] text-[9px] uppercase tracking-[0.15em] font-medium">
            <Link href="/privacy-policy" className="hover:text-[#1a1a1a] transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-condition" className="hover:text-[#1a1a1a] transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-[#1a1a1a] transition-colors">Cookie Preferences</Link>
          </div>

          <p className="text-[#888] text-[9px] uppercase tracking-[0.2em] font-medium text-center md:text-right">
            © {new Date().getFullYear()} Asaya Official
          </p>
          
        </div>

      </div>
    </footer>
  );
}