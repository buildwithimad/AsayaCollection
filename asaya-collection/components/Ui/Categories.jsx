'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllCategories } from '@/services/categoryServices';

export default function CategoryDrawer({ isOpen, onClose }) {
  // State to hold the real categories from the database
  const [categories, setCategories] = useState([]);

  // 1. Fetch categories on mount (MUST be inside the component)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        
        // Format the fetched categories to match your UI design (adding 01, 02, etc.)
        const formattedCategories = fetchedCategories.map((cat, index) => ({
          num: (index + 1).toString().padStart(2, '0'), // Turns 1 into "01"
          name: cat.name,
          href: `/collections?category=${encodeURIComponent(cat.name)}` // Routes to your products page
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 2. Lock body scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Dimmed Background Overlay */}
      <div 
        className={`fixed inset-0 bg-[#1a1a1a]/20 backdrop-blur-sm z-[55] transition-opacity duration-500 cursor-pointer ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

      {/* The Category Panel - Soft pink background */}
      <div 
        className={`fixed top-0 left-0 h-full w-full md:w-1/2 lg:w-[40%] bg-[#faeceb] text-[#1a1a1a] shadow-2xl z-[60] flex flex-col justify-center px-12 lg:px-24 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 left-8 md:top-12 md:left-12 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors duration-300 cursor-pointer"
        >
          <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="uppercase tracking-[0.3em] text-[#1a1a1a]/50 text-[10px] sm:text-xs font-medium mb-12 block">
          Curated Silhouettes
        </span>

        <ul className="flex flex-col gap-6 md:gap-8">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <li key={index} className="group overflow-hidden flex items-baseline gap-6">
                <span className="text-[#1a1a1a]/40 text-sm font-light tracking-widest transition-colors duration-500 group-hover:text-[#1a1a1a]/80">
                  {category.num}
                </span>
                <Link
                  href={category.href}
                  onClick={onClose}
                  className={`block text-3xl md:text-5xl font-light tracking-wide text-[#1a1a1a] hover:opacity-60 transition-all duration-500 transform ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[100%] opacity-0'
                  }`}
                  style={{ transitionDelay: `${isOpen ? 200 + index * 80 : 0}ms` }}
                >
                  {category.name}
                </Link>
              </li>
            ))
          ) : (
            // Loading state while fetching
            <div className="text-sm font-light text-[#1a1a1a]/50 tracking-widest uppercase">
              Loading Collection...
            </div>
          )}
        </ul>
      </div>
    </>
  );
}