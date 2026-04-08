'use client';

import { usePathname } from 'next/navigation';
import { processAdminLogout } from '@/app/action/authActions';
import { useTransition } from 'react';

export default function AdminNavbar({ setSidebarOpen }) {
    const [isPending, startTransition] = useTransition();
  const pathname = usePathname();


  const handleLogout = () => {
    startTransition(async () => {
      await processAdminLogout();
    });
  };
  
  // Format pathname to look like a title (e.g., "/orders" -> "ORDERS")
  const title = pathname.split('/')[1] 
    ? pathname.split('/')[1].toUpperCase()
    : 'DASHBOARD';

  return (
    <header className="h-20 bg-[#fdfbfb] border-b border-[#e5e5e5] flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 transition-all duration-300">
      
      <div className="flex items-center gap-6">
        
        {/* Mobile Hamburger Button - Public Store Design */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex flex-col items-start justify-center cursor-pointer w-8 h-8 group focus:outline-none"
          aria-label="Open Menu"
        >
          <span className="w-6 h-[1px] bg-[#1a1a1a] mb-[5px] transition-all duration-300 group-hover:w-4"></span>
          <span className="w-4 h-[1px] bg-[#1a1a1a] transition-all duration-300 group-hover:w-6"></span>
        </button>

        {/* Dynamic Page Title - Thin & Spaced */}
        <h1 className="text-sm md:text-base font-light tracking-[0.2em] text-[#1a1a1a]">
          {title}
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-[#1a1a1a] hover:opacity-60 transition-opacity duration-300">
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {/* Sharp square notification dot instead of a circle */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#1a1a1a]"></span>
        </button>

        {/* Action Button */}
        <button onClick={handleLogout} className="hidden sm:block rounded-xl bg-red-700 cursor-pointer text-white px-5 py-2.5 text-[9px] uppercase tracking-[0.25em] font-bold hover:bg-red-900  transition-colors duration-500">
          Logout &rarr;
        </button>

      </div>

    </header>
  );
}