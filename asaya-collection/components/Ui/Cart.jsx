'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore'; // Adjust path to your Zustand store

export default function Cart({ isOpen, onClose }) {
  // Hydration state to prevent Next.js mismatch errors with localStorage
  const [isMounted, setIsMounted] = useState(false);

  // Pull global state and actions directly from Zustand
  const { cart, addToCart, decreaseQty, removeFromCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scrolling when the cart is open
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

  // Calculate dynamic totals
  // We only calculate if mounted to ensure server and client match
  const totalItems = isMounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const subtotal = isMounted ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

  // Don't render the cart internals until the client has hydrated from localStorage
  if (!isMounted) return null;

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 bg-[#1a1a1a]/20 backdrop-blur-sm z-50 transition-opacity duration-500 cursor-pointer ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-out Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#fdfbfb] shadow-2xl z-50 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-[100%]'
        }`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1a1a1a]/10">
          <h2 className="text-[#1a1a1a] text-sm uppercase tracking-[0.2em] font-medium">
            Your Bag ({totalItems})
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:opacity-50 transition-opacity group cursor-pointer"
          >
            <svg className="w-6 h-6 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" className="transition-transform group-hover:rotate-90 duration-300 origin-center" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                {/* Product Image */}
                <div className="relative w-24 h-32 bg-[#faeceb]/40 shrink-0 border border-[#1a1a1a]/5">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                
                {/* Product Info & Actions */}
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[#1a1a1a] text-sm font-light tracking-wide">{item.name}</h3>
                      
                      {/* Remove Item Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors text-xs cursor-pointer p-1 -mr-1"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[#666] text-[10px] uppercase tracking-[0.1em]">{item.color || "Standard"}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#1a1a1a]/20">
                      <button 
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1 text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xs w-4 text-center select-none">{item.quantity}</span>
                      
                      {/* Note: addToCart in your store handles incrementing if it already exists */}
                      <button 
                        onClick={() => addToCart(item)}
                        className="px-3 py-1 text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[#1a1a1a] text-sm font-medium">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 mb-6 rounded-full bg-[#faeceb]/40 flex items-center justify-center border border-[#1a1a1a]/5">
                <svg className="w-6 h-6 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-[#666] font-light tracking-wide mb-6">Your bag is currently empty.</p>
              <button 
                onClick={onClose}
                className="border-b border-[#1a1a1a] pb-1 text-[#1a1a1a] text-xs uppercase tracking-[0.2em] font-medium cursor-pointer transition-opacity hover:opacity-60"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="px-8 py-8 border-t border-[#1a1a1a]/10 bg-[#fdfbfb]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#1a1a1a] text-sm uppercase tracking-[0.1em] font-medium">Subtotal</span>
              <span className="text-[#1a1a1a] text-lg font-light">${subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[#666] text-[10px] tracking-wide mb-6">Shipping and taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center bg-[#1a1a1a] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium cursor-pointer hover:bg-[#333] transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}