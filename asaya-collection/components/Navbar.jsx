'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import Cart from '@/components/Ui/Cart'; 
import { useCartStore } from '@/store/cartStore'; 
import { supabase } from '@/lib/supabase'; // Kept ONLY for the logout function
import { getAllCategories } from '@/services/categoryServices'; 
import { useUser } from '@/context/UserContext'; // 🌟 Import your global user context

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 🌟 Grab the user instantly from the global context! No loading, no flickering.
  const user = useUser();
  
  // Auth & Dropdown State
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  // Hydration state for Zustand persist
  const [isMounted, setIsMounted] = useState(false);

  // Pull cart data directly from Zustand
  const cartItems = useCartStore((state) => state.cart);

  useEffect(() => {
    setIsMounted(true);

    // Track scrolling for dynamic navbar border
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        const sortedData = data?.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedData || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scrolling when drawers are open
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isCartOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsProfileDropdownOpen(false); 
      // Force a hard reload so the Server Components (layout.js) know the cookie is gone
      window.location.reload(); 
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const totalItems = isMounted 
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0) 
    : 0;

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-5 flex items-center justify-between bg-[#fdfbfb] transition-all duration-300 ${isScrolled ? 'border-b border-[#e5e5e5] py-4' : 'border-b border-transparent py-6'}`}>
        
        {/* Left: Logo */}
        <div className="w-1/3 flex justify-start">
          <Link href="/" className="hover:opacity-70 transition-opacity duration-300 inline-block">
            <Image 
              src="/Logo.png" 
              alt="Asaya Official Logo" 
              width={180} 
              height={60} 
              className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'}`}
              priority
            />
          </Link>
        </div>

        {/* Center: Hamburger Menu */}
        <div className="w-1/3 flex justify-center">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center cursor-pointer w-12 h-10 group focus:outline-none"
            aria-label="Open Menu"
          >
            <span className="w-8 h-[1px] bg-[#1a1a1a] mb-[6px] transition-all duration-300 group-hover:w-6"></span>
            <span className="w-6 h-[1px] bg-[#1a1a1a] transition-all duration-300 group-hover:w-8"></span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="w-1/3 flex justify-end items-center gap-5 md:gap-7">
          
          {/* --- USER ACCOUNT --- */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                aria-label="Profile Menu" 
                className="hover:opacity-60 cursor-pointer transition-opacity duration-300 flex items-center justify-center focus:outline-none"
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-[#1a1a1a]/10"
                  />
                ) : (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[9px] uppercase font-bold tracking-widest">
                    {user.email?.charAt(0)}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  ></div>
                  
                  <div className="absolute right-0 top-full mt-5 w-56 bg-white border border-[#e5e5e5] shadow-sm flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-4 border-b border-[#e5e5e5] bg-[#faf9f8]">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-1">Account</p>
                      <p className="text-xs text-[#1a1a1a] font-medium truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/orders" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="px-6 py-4 text-xs font-light tracking-wide text-[#1a1a1a] hover:bg-[#faf9f8] transition-colors flex items-center gap-3"
                    >
                      Order History
                    </Link>
                    
                    <button 
                      onClick={handleLogout} 
                      className="px-6 py-4 text-xs font-medium tracking-wide text-[#b33a3a] hover:bg-[#faf9f8] cursor-pointer transition-colors text-left border-t border-[#e5e5e5]"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" aria-label="Sign In" className="hover:opacity-50 cursor-pointer transition-opacity duration-300">
              <svg className="w-5 h-5 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          )}

          {/* Guest Tracking */}
          {!user && (
            <Link href="/orders" aria-label="Track Order" className="hover:opacity-50 cursor-pointer transition-opacity duration-300">
              <svg className="w-5 h-5 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </Link>
          )}
          
          {/* Shopping Cart */}
          <button 
            aria-label="Shopping Cart" 
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer hover:opacity-50 transition-opacity duration-300"
          >
            <svg className="w-5 h-5 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#1a1a1a] text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full border border-[#fdfbfb]">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* External Drawer */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
      />

      {/* --- LEFT SIDE MENU DRAWER --- */}
      <div
        className={`fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[420px] z-50 bg-[#fdfbfb] shadow-2xl flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] border-r border-[#e5e5e5] ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Drawer Header */}
        <div className="flex justify-end p-6 border-b border-[#e5e5e5]">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors duration-300 group cursor-pointer flex items-center gap-3"
          >
            <span className="uppercase tracking-[0.2em] text-[10px] font-medium hidden sm:block">Close</span>
            <svg className="w-8 h-8 stroke-current group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <ul className="flex flex-col gap-8">
            
            <li className="overflow-hidden">
              <Link
                href="/collections"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: '150ms' }}
              >
                Shop Collection
              </Link>
            </li>

            {/* --- CATEGORIES ACCORDION --- */}
            <li className="overflow-hidden flex flex-col">
              <button
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className={`flex justify-between items-center text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform cursor-pointer w-full text-left ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: '250ms' }}
              >
                <span>Categories</span>
                <svg 
                  className={`w-5 h-5 stroke-current transition-transform duration-500 ${isCategoriesExpanded ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" strokeWidth="1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <div 
                className={`flex flex-col pl-4 border-l border-[#e5e5e5] ml-2 overflow-hidden transition-all duration-500 ease-in-out ${isCategoriesExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/collections?category=${cat.name}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[11px] sm:text-xs uppercase tracking-[0.15em] font-medium text-[#666] hover:text-[#1a1a1a] hover:bg-[#faf9f8] px-3 py-3 rounded-sm transition-all duration-300 block"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-[11px] sm:text-xs text-[#888] italic px-3 py-2">Loading...</span>
                )}
              </div>
            </li>

            <li className="overflow-hidden">
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: '350ms' }}
              >
                Our Story
              </Link>
            </li>
            
            <li className="overflow-hidden">
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: '450ms' }}
              >
                Contact
              </Link>
            </li>

          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="p-8 border-t border-[#e5e5e5] bg-[#faf9f8] flex flex-col gap-5">
          <div className="flex gap-6 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">
            <Link href="#" className="hover:text-[#888] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5">Instagram</Link>
            <Link href="#" className="hover:text-[#888] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5">TikTok</Link>
            <Link href="#" className="hover:text-[#888] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5">Pinterest</Link>
          </div>
          <span className="text-[#888] text-[8px] uppercase tracking-[0.25em]">
            Asaya Official © 2026
          </span>
        </div>

      </div>
    </>
  );
}