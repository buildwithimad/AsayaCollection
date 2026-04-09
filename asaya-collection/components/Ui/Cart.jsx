'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { useCartStore } from '@/store/cartStore'; 

export default function Cart({ isOpen, onClose }) {
  const router = useRouter(); 
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  // 🌟 State to track the ID of the item currently being removed
  const [removingItemId, setRemovingItemId] = useState(null);

  // Pull global state and actions directly from Zustand
  const { cart, addToCart, decreaseQty, removeFromCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scrolling when the cart is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => document.body.style.overflow = '';
  }, [isOpen]);

  const totalItems = isMounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const subtotal = isMounted ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

  // Handle Checkout Navigation
  const handleCheckout = (e) => {
    e.preventDefault();
    setIsCheckoutLoading(true);
    setTimeout(() => {
      router.push('/checkout');
      onClose(); 
      setIsCheckoutLoading(false); 
    }, 500);
  };

  // 🌟 Handle Item Removal with Feedback
  const handleRemoveItem = (id) => {
    setRemovingItemId(id); // Start loading state for this specific item

    // Wait 500ms so the user sees the spinner/feedback, then actually remove it
    setTimeout(() => {
      removeFromCart(id);
      setRemovingItemId(null); // Reset
    }, 500);
  };

  if (!isMounted) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#1a1a1a]/20 backdrop-blur-sm z-50 transition-opacity duration-500 cursor-pointer ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

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
              <div 
                key={item.id} 
                className={`flex gap-6 group transition-all duration-300 ${removingItemId === item.id ? 'opacity-40 scale-95 pointer-events-none' : 'opacity-100'}`}
              >
                {/* Product Image */}
                <div className="relative w-24 h-32 bg-[#faeceb]/40 shrink-0 border border-[#1a1a1a]/5 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  
                  {/* 🌟 Visual overlay when removing */}
                  {removingItemId === item.id && (
                    <div className="absolute inset-0 bg-[#fdfbfb]/60 backdrop-blur-sm flex items-center justify-center">
                       <svg className="w-5 h-5 text-[#1a1a1a] animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Product Info & Actions */}
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1 relative">
                      <h3 className="text-[#1a1a1a] text-sm font-light tracking-wide">{item.name}</h3>
                      
                      {/* 🌟 Updated Remove Item Button */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItemId === item.id}
                        className="text-[#1a1a1a]/40 hover:text-[#b33a3a] transition-colors text-xs cursor-pointer p-1 -mr-1 relative w-6 h-6 flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        {removingItemId === item.id ? (
                           <span className="text-[8px] uppercase tracking-widest text-[#b33a3a] font-bold absolute right-0 whitespace-nowrap">
                             Removing...
                           </span>
                        ) : (
                          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-[#666] text-[10px] uppercase tracking-[0.1em]">{item.color || "Standard"}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-[#1a1a1a]/20">
                      <button 
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1 text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1 || removingItemId === item.id}
                      >
                        -
                      </button>
                      <span className="text-xs w-4 text-center select-none">{item.quantity}</span>
                      
                      <button 
                        onClick={() => addToCart(item)}
                        className="px-3 py-1 text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-30"
                        disabled={removingItemId === item.id}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[#1a1a1a] text-sm font-medium">
                      Rs {(item.price * item.quantity).toLocaleString()}
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
              <span className="text-[#1a1a1a] text-lg font-light">Rs {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[#666] text-[10px] tracking-wide mb-6">Shipping and taxes calculated at checkout.</p>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full relative flex items-center justify-center bg-[#1a1a1a] text-white py-4 text-xs uppercase tracking-[0.2em] font-medium cursor-pointer transition-all overflow-hidden disabled:bg-[#333] disabled:cursor-wait"
            >
              <span className={`transition-all duration-300 transform ${isCheckoutLoading ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
                Proceed to Checkout
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isCheckoutLoading ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}