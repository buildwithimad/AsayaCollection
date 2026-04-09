'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import Cart from '@/components/Ui/Cart'; 
import { useCartStore } from '@/store/cartStore'; 
import { supabase } from '@/lib/supabase'; 
import { getAllCategories } from '@/services/categoryServices'; 
import { useUser } from '@/context/UserContext'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const user = useUser();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 🌟 PULL CART STATE FROM ZUSTAND
  const cartItems = useCartStore((state) => state.cart);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scrolling when drawers are open
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => document.body.style.overflow = '';
  }, [isMenuOpen, isCartOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsProfileDropdownOpen(false); 
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
      <nav className={`fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-5 flex items-center justify-between bg-[#fdfbfb] transition-all duration-300 ${isScrolled ? 'border-b border-[#e5e5e5] py-3' : 'border-b border-transparent py-5'}`}>
        
        {/* --- LEFT: HAMBURGER MENU --- */}
        <div className="w-1/3 flex justify-start items-center">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none"
            aria-label="Open Menu"
          >
            <div className="flex flex-col items-start justify-center w-8 h-8">
              <span className="w-8 h-[1px] bg-[#1a1a1a] mb-[6px] transition-all duration-300 group-hover:w-6"></span>
              <span className="w-6 h-[1px] bg-[#1a1a1a] transition-all duration-300 group-hover:w-8"></span>
            </div>
            {/* Added "MENU" text for a more premium desktop feel */}
            <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-medium text-[#1a1a1a] group-hover:text-[#888] transition-colors mt-0.5">
              Menu
            </span>
          </button>
        </div>

        {/* --- CENTER: BIG LOGO --- */}
        <div className="w-1/3 flex justify-center">
          <Link href="/" className="hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
            <Image 
              src="/Logo.png" 
              alt="Asaya Official Logo" 
              width={240} 
              height={80} 
              className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-16 lg:h-20'}`}
              priority
            />
          </Link>
        </div>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="w-1/3 flex justify-end items-center gap-5 md:gap-7">
          
          {/* USER ACCOUNT */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="hover:opacity-60 cursor-pointer transition-opacity duration-300 flex items-center justify-center focus:outline-none"
              >
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-[#1a1a1a]/10" />
                ) : (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[9px] uppercase font-bold tracking-widest">
                    {user.email?.charAt(0)}
                  </div>
                )}
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-5 w-56 bg-white border border-[#e5e5e5] shadow-sm flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-4 border-b border-[#e5e5e5] bg-[#faf9f8]">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-1">Account</p>
                      <p className="text-xs text-[#1a1a1a] font-medium truncate">{user.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setIsProfileDropdownOpen(false)} className="px-6 py-4 text-xs font-light tracking-wide text-[#1a1a1a] hover:bg-[#faf9f8] transition-colors flex items-center gap-3">
                      Order History
                    </Link>
                    <button onClick={handleLogout} className="px-6 py-4 text-xs font-medium tracking-wide text-[#b33a3a] hover:bg-[#faf9f8] cursor-pointer transition-colors text-left border-t border-[#e5e5e5]">
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:opacity-50 cursor-pointer transition-opacity duration-300">
              <svg className="w-5 h-5 md:w-[22px] md:h-[22px] stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          )}

          {/* Guest Order Tracking */}
          {!user && (
            <Link href="/orders" className="hover:opacity-50 cursor-pointer transition-opacity duration-300">
              <svg className="w-5 h-5 md:w-[22px] md:h-[22px] stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </Link>
          )}
          
          {/* Shopping Cart Button */}
          <button 
            onClick={openCart}
            className="relative cursor-pointer hover:opacity-50 transition-opacity duration-300"
          >
            <svg className="w-5 h-5 md:w-[22px] md:h-[22px] stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#1a1a1a] text-white text-[9px] font-medium w-[18px] h-[18px] flex items-center justify-center rounded-full border-[1.5px] border-[#fdfbfb]">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* External Drawer */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={closeCart} 
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
        <div className="flex justify-end p-6 border-b border-[#e5e5e5]">
          <button onClick={() => setIsMenuOpen(false)} className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors duration-300 group cursor-pointer flex items-center gap-3">
            <span className="uppercase tracking-[0.2em] text-[10px] font-medium hidden sm:block">Close</span>
            <svg className="w-8 h-8 stroke-current group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10">
          <ul className="flex flex-col gap-8">
            <li className="overflow-hidden">
              <Link href="/collections" onClick={() => setIsMenuOpen(false)} className={`block text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '150ms' }}>
                Shop Collection
              </Link>
            </li>

            <li className="overflow-hidden flex flex-col">
              <button onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)} className={`flex justify-between items-center text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform cursor-pointer w-full text-left ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '250ms' }}>
                <span>Categories</span>
                <svg className={`w-5 h-5 stroke-current transition-transform duration-500 ${isCategoriesExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`flex flex-col pl-4 border-l border-[#e5e5e5] ml-2 overflow-hidden transition-all duration-500 ease-in-out ${isCategoriesExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                {categories.length > 0 ? categories.map((cat) => (
                  <Link key={cat.id} href={`/collections?category=${cat.name}`} onClick={() => setIsMenuOpen(false)} className="text-[11px] sm:text-xs uppercase tracking-[0.15em] font-medium text-[#666] hover:text-[#1a1a1a] hover:bg-[#faf9f8] px-3 py-3 rounded-sm transition-all duration-300 block">
                    {cat.name}
                  </Link>
                )) : <span className="text-[11px] sm:text-xs text-[#888] italic px-3 py-2">Loading...</span>}
              </div>
            </li>

            <li className="overflow-hidden">
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className={`block text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '350ms' }}>
                Our Story
              </Link>
            </li>
            
            <li className="overflow-hidden">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={`block text-[#1a1a1a] text-2xl md:text-3xl font-light tracking-tight hover:text-[#888] transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ transitionDelay: '450ms' }}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-8 border-t border-[#e5e5e5] bg-[#faf9f8] flex flex-col gap-5">
          
          <span className="text-[#888] text-[8px] uppercase tracking-[0.25em]">
            Asaya Official © 2026
          </span>
        </div>
      </div>
    </>
  );
}