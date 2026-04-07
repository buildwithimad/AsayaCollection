'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore'; // Ensure this path matches your store location

export default function AddToCartButton({ 
  product, 
  variant = 'primary', // 'primary', 'glass', or 'outline'
  fullWidth = true,
  onClick,
  className = ''
}) {
  const [isAdded, setIsAdded] = useState(false);
  
  // Pull the addToCart function from your Zustand store
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = (e) => {
    // Prevent event bubbling if the button is inside a clickable card (like a Link)
    e.stopPropagation();
    e.preventDefault();

    // 1. Add the product to the global Zustand cart
    if (product) {
      addToCart(product);
    }

    // 2. Trigger any custom onClick if provided (e.g., to open a drawer)
    if (onClick) onClick(product);

    // 3. Show temporary "Added" feedback state
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000); // Reverts back after 2 seconds
  };

  // --- Variant Styles ---
  const baseStyles = "relative flex items-center justify-center text-[10px] cursor-pointer uppercase tracking-[0.2em] font-medium py-4 px-8 transition-colors duration-300 overflow-hidden";
  const widthStyles = fullWidth ? "w-full" : "w-auto";
  
  const variantStyles = {
    // Solid charcoal - best for product pages or standard grids
    primary: "bg-[#1a1a1a] text-[#fdfbfb] hover:bg-[#333]",
    
    // Translucent blur - best for hovering directly over images (like your Quick Add)
    glass: "bg-[#fdfbfb]/90 backdrop-blur-sm text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfbfb]",
    
    // Minimalist border - best for secondary actions
    outline: "border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfbfb]"
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={isAdded}
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className}`}
    >
      {/* Using absolute positioning for the states allows for a smooth, 
        jump-free transition without the button changing size 
      */}
      <span className={`transition-all duration-300 transform ${isAdded ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
        {variant === 'glass' ? 'Quick Add' : 'Add to Cart'}
      </span>
      
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isAdded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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