'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { processAdminLogout } from '@/app/action/authActions';
import { supabase } from '@/lib/supabase';

export default function AdminNavbar({ setSidebarOpen }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [bellAnimating, setBellAnimating] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setBellAnimating(true);
          setTimeout(() => setBellAnimating(false), 500);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrderClick = (orderId) => {
    setShowDropdown(false);
    setNotifications((prev) => prev.filter(n => n.id !== orderId)); 
    router.push(`/orders/${orderId}`);
  };

  const handleLogout = () => {
    startTransition(async () => {
      await processAdminLogout();
    });
  };

  const title = pathname.split('/')[1] ? pathname.split('/')[1].toUpperCase() : 'DASHBOARD';

  return (
    <header className="h-20 bg-[#fdfbfb]/80 backdrop-blur-md border-b border-[#e5e5e5] flex items-center justify-between px-6 lg:px-10 z-40 sticky top-0">
      
      <div className="flex items-center gap-6">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 group">
          <span className="block w-6 h-[1px] bg-[#1a1a1a] mb-[5px] transition-all group-hover:w-4"></span>
          <span className="block w-4 h-[1px] bg-[#1a1a1a] transition-all group-hover:w-6"></span>
        </button>
        <h1 className="text-sm font-light tracking-[0.2em] text-[#1a1a1a]">{title}</h1>
      </div>

      <div className="flex items-center gap-6" ref={dropdownRef}>
        
        {/* --- NOTIFICATION CENTER --- */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative p-2 transition-all cursor-pointer duration-300 rounded-full hover:bg-slate-100 ${bellAnimating ? 'scale-110 rotate-12' : 'scale-100'}`}
          >
            <svg className={`w-5 h-5 transition-colors ${notifications.length > 0 || showDropdown ? 'text-[#1a1a1a]' : 'text-[#888]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
              </span>
            )}
          </button>

          {/* --- SMOOTH DROPDOWN PANEL --- */}
          <div 
            className={`absolute right-0 mt-4 w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right ${
              showDropdown ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
            }`}
          >
            {/* Dropdown Header */}
            <div className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/50">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">Notifications</h3>
              {notifications.length > 0 && (
                <span className="bg-[#fce3de] text-rose-900 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {notifications.length} New
                </span>
              )}
            </div>
            
            {/* Scrollable List */}
            <div className="max-h-[420px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
                  <svg className="w-10 h-10 mb-4 stroke-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">You're all caught up</p>
                  <p className="text-[10px] text-slate-400 mt-1">No new orders right now.</p>
                </div>
              ) : (
                notifications.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => handleOrderClick(order.id)}
                    className="p-5 flex items-start gap-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 group"
                  >
                    {/* Elegant Icon Container */}
                    <div className="w-10 h-10 rounded-full bg-[#fce3de]/30 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>

                    {/* Notification Content */}
                    <div className="flex flex-col flex-1">
                      {/* Status Message */}
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        New Order Placed
                      </span>
                      
                      {/* Customer Info */}
                      <span className="text-sm font-medium text-slate-900 group-hover:text-rose-600 transition-colors">
                        {order.customer_name || 'Guest Customer'}
                      </span>
                      
                      {/* Order Details */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-slate-500">#{order.order_number || order.id.slice(0,8).toUpperCase()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-medium text-slate-700">Rs. {order.total_amount?.toLocaleString()}</span>
                      </div>

                      {/* Timestamp (Realtime means it just happened) */}
                      <span className="text-[9px] text-slate-400 mt-2 uppercase tracking-widest">Just Now</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Dropdown Footer */}
            {notifications.length > 0 && (
              <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setNotifications([])}
                  className="w-full py-3 cursor-pointer rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-200"
                >
                  Dismiss All
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="hidden sm:block cursor-pointer rounded-xl bg-rose-600 text-white px-5 py-2.5 text-[9px] uppercase tracking-[0.25em] font-bold hover:bg-rose-700 transition-colors duration-300 active:scale-95 shadow-lg shadow-black/5"
        >
          {isPending ? '...' : 'Logout \u2192'}
        </button>
      </div>
    </header>
  );
}