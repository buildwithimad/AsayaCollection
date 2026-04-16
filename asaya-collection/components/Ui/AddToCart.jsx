'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore'; 

export default function AddToCartButton({ 
  product, 
  variant = 'primary', 
  fullWidth = true,
  onClick,
  className = '',
  disabled = false,        // 🌟 Accepts the disabled state from ProductDetails
  quantityToAdd = 1        // 🌟 Accepts the quantity from the selector
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  // Pull functions from Zustand
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  const handleAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Prevent adding if no product or if button is disabled
    if (!product || disabled) return;

    // 1. Trigger Loading State
    setIsAdding(true);

    // 2. Simulate network delay for premium feel (500ms)
    setTimeout(() => {
      // Add to global cart WITH the specified quantity
      addToCart(product, quantityToAdd);
      
      // Open the Cart Drawer automatically
      if (openCart) openCart();
      if (onClick) onClick(product);

      // Swap to "Added" state
      setIsAdding(false);
      setIsAdded(true);

      // Revert button to normal after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 500);
  };

  const baseStyles = "relative flex items-center justify-center text-[10px] uppercase tracking-[0.2em] font-medium py-4 px-8 transition-colors duration-300 overflow-hidden";
  const widthStyles = fullWidth ? "w-full" : "w-auto";
  
  const variantStyles = {
    primary: "bg-[#1a1a1a] text-[#fdfbfb] hover:bg-[#333]",
    glass: "bg-[#fdfbfb]/90 backdrop-blur-sm text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfbfb]",
    outline: "border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfbfb]"
  };

  // 🌟 Handle Disabled Styling
  const isButtonDisabled = disabled || isAdding || isAdded;
  const cursorStyle = disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer";

  // 🌟 Smart Button Text based on stock
  let buttonText = variant === 'glass' ? 'Quick Add' : 'Add to Cart';
  if (disabled) {
    buttonText = product?.stock === 0 ? 'Out of Stock' : 'Max Stock Reached';
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={isButtonDisabled}
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${cursorStyle} ${className}`}
    >
      {/* 1. DEFAULT STATE: Text */}
      <span className={`transition-all duration-300 transform ${isAdding || isAdded ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
        {buttonText}
      </span>
      
      {/* 2. LOADING STATE: Spinner */}
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isAdding ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <svg className="w-4 h-4 text-current animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>

      {/* 3. ADDED STATE: Checkmark */}
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isAdded && !isAdding ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Added
        </span>
      </span>
    </button>
  );
}