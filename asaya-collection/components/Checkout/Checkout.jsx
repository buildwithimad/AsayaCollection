'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutEmptyState from '@/components/Ui/CheckoutEmptyState'; 
import { useCartStore } from '@/store/cartStore'; 
import { supabase } from '@/lib/supabase';
import { processSecureCheckout } from '@/app/actions/checkoutAction'; 

export default function Checkout() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // --- AUTH STATE ---
  const [userId, setUserId] = useState(null);

  // --- FORM STATE ---
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState(''); 
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SUCCESS STATE ---
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState(null); // Snapshot to freeze the UI

  useEffect(() => {
    setIsMounted(true);
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setEmail(session.user.email);
      }
    };
    checkUser();
  }, []);

  // Visual calculation for the UI ONLY. Real math happens on the server.
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'express' ? 500 : 250; 
  const total = subtotal + shippingCost;

  // --- HANDLE ORDER SUBMISSION ---
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      firstName, lastName, email, phone, address, landmark, city, province, zipcode, shippingMethod
    };

    // Trigger our Secure Server Action
    const result = await processSecureCheckout(formData, cart, userId);

    if (result.success) {
      localStorage.setItem('guestEmail', email.trim().toLowerCase());
      setCompletedOrderNumber(result.orderNumber);
      
      // Freeze the data so the right column doesn't go blank when we clear the cart!
      setOrderSnapshot({
        items: [...cart],
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: total
      });

      setIsSuccess(true);
      if (clearCart) clearCart();
    } else {
      console.error(result.message);
      alert("There was an issue placing your order. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(completedOrderNumber);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!isMounted) return null; 

  if (cart.length === 0 && !isSuccess) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-24 md:pt-32 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row gap-16 lg:gap-24">
        
        {/* --- LEFT COLUMN --- */}
        <div className="w-full lg:w-3/5">
          
          {isSuccess ? (
            /* --- SUCCESS VIEW --- */
            <div className="flex flex-col items-center text-center pt-10 lg:pt-20">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-8">
                <svg className="w-8 h-8 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Order Confirmed</h2>
              <p className="text-[#666] text-sm font-light mb-8 leading-relaxed max-w-md">
                Thank you for your purchase. Your order has been received and is now being processed. We've sent a confirmation email to <strong>{email}</strong>.
              </p>
              
              <div className="w-full max-w-sm bg-[#faf9f8] border border-[#e5e5e5] p-6 mb-10 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Order Number</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-medium tracking-wider">{completedOrderNumber}</span>
                  <button 
                    onClick={handleCopyOrderNumber}
                    className="p-2 hover:bg-[#e5e5e5]/50 transition-colors rounded-sm"
                    title="Copy Order Number"
                  >
                    {hasCopied ? (
                      <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 stroke-[#666]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Link 
                  href="/orders" 
                  className="flex-1 border border-[#1a1a1a] text-[#1a1a1a] py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#faf9f8] transition-colors text-center"
                >
                  Track Order
                </Link>
                <Link 
                  href="/collections" 
                  className="flex-1 bg-[#1a1a1a] text-[#fdfbfb] py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#333] transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            /* --- CHECKOUT FORM VIEW --- */
            <form onSubmit={handleCheckout} className="space-y-12">
              
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-xl font-light tracking-wide">Contact</h2>
                  {!userId && (
                    <Link href="/login" className="text-[10px] uppercase tracking-[0.1em] text-[#666] underline hover:text-[#1a1a1a]">
                      Log in
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className={`w-full bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none ${userId ? 'text-[#666] cursor-not-allowed' : ''}`}
                    required
                    readOnly={!!userId}
                  />
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#1a1a1a]" />
                    <span className="text-xs text-[#666] font-light">Email me with news and offers</span>
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-light tracking-wide mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="col-span-2 relative">
                    <select 
                      disabled 
                      className="w-full bg-[#f4f4f4] border border-[#1a1a1a]/10 px-4 py-3.5 text-sm font-light text-[#1a1a1a] focus:outline-none rounded-none appearance-none cursor-not-allowed opacity-70"
                    >
                      <option>Pakistan</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 stroke-[#666]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>

                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name" 
                    className="col-span-1 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                    required
                  />
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name" 
                    className="col-span-1 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                    required
                  />
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address (House/Street/Area)" 
                    className="col-span-2 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                    required
                  />
                  <input 
                    type="text" 
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Apartment, suite, block, landmark (optional)" 
                    className="col-span-2 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                  />
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City" 
                    className="col-span-1 sm:col-span-2 md:col-span-1 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                    required
                  />
                  
                  <div className="col-span-1 sm:col-span-1 md:col-span-1 relative">
                    <select 
                      required
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none appearance-none cursor-pointer invalid:text-[#666]/60"
                    >
                      <option value="" disabled hidden>Province</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad">Islamabad Capital Territory</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>

                  <input 
                    type="text" 
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Postal Code (Optional)" 
                    className="col-span-2 sm:col-span-1 md:col-span-1 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                  />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (e.g. 0300 1234567)" 
                    className="col-span-2 sm:col-span-1 md:col-span-1 bg-transparent border border-[#1a1a1a]/20 px-4 py-3.5 text-sm font-light placeholder:text-[#666]/60 focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                    required
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-light tracking-wide mb-6">Shipping Method</h2>
                <div className="border border-[#1a1a1a]/20 rounded-none overflow-hidden">
                  <label className={`flex justify-between items-center p-4 cursor-pointer border-b border-[#1a1a1a]/10 transition-colors ${shippingMethod === 'standard' ? 'bg-[#faeceb]/30' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="w-4 h-4 accent-[#1a1a1a]" 
                      />
                      <div>
                        <span className="block text-sm font-medium">Standard Delivery</span>
                        <span className="block text-xs text-[#666] font-light mt-0.5">3 to 5 business days</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Rs. 250</span>
                  </label>
                  <label className={`flex justify-between items-center p-4 cursor-pointer transition-colors ${shippingMethod === 'express' ? 'bg-[#faeceb]/30' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="w-4 h-4 accent-[#1a1a1a]" 
                      />
                      <div>
                        <span className="block text-sm font-medium">Express Delivery</span>
                        <span className="block text-xs text-[#666] font-light mt-0.5">1 to 2 business days</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Rs. 500</span>
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-light tracking-wide mb-6">Payment</h2>
                <p className="text-xs text-[#666] font-light mb-4">All transactions are secure and encrypted.</p>
                
                <div className="border border-[#1a1a1a]/20 p-6 bg-[#faeceb]/20">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input 
                      type="radio" 
                      checked 
                      readOnly 
                      className="w-4 h-4 mt-0.5 accent-[#1a1a1a]" 
                    />
                    <div>
                      <span className="block text-sm font-medium text-[#1a1a1a]">Cash on Delivery (COD)</span>
                      <span className="block text-xs text-[#666] font-light mt-1.5 leading-relaxed">
                        Pay with cash upon delivery. Please ensure you have the exact amount ready to avoid delays.
                      </span>
                    </div>
                  </label>
                </div>
              </section>

              <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#1a1a1a] text-[#fdfbfb] py-5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing Order...' : 'Confirm Order'}
                </button>
              </div>
              
            </form>
          )}
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className={`w-full lg:w-2/5 ${isSuccess ? 'hidden lg:block opacity-50 pointer-events-none' : ''}`}>
          <div className="lg:sticky lg:top-32 bg-[#faeceb]/10 border border-[#1a1a1a]/10 p-6 md:p-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.15em] mb-8">Order Summary</h2>
            
            <div className="flex flex-col gap-6 mb-8 border-b border-[#1a1a1a]/10 pb-8">
              {/* If snapshot exists, map over snapshot items. Otherwise, map live cart */}
              {(orderSnapshot ? orderSnapshot.items : cart).map((item) => (
                <div key={`${item.id}-${item.color}`} className="flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-[#faeceb]/40 shrink-0 border border-[#1a1a1a]/5">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-[#fdfbfb] text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-light">{item.name}</h3>
                    <p className="text-[10px] text-[#666] uppercase tracking-wider mt-1">{item.color || 'Standard'}</p>
                  </div>
                  <span className="text-sm font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-sm font-light mb-6 border-b border-[#1a1a1a]/10 pb-6">
              <div className="flex justify-between">
                <span className="text-[#666]">Subtotal</span>
                <span>Rs. {(orderSnapshot ? orderSnapshot.subtotal : subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Shipping</span>
                <span>Rs. {(orderSnapshot ? orderSnapshot.shippingCost : shippingCost).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-base font-medium">Total</span>
              <span className="text-2xl font-light">
                <span className="text-[10px] text-[#666] uppercase mr-2 tracking-widest">PKR</span>
                Rs. {(orderSnapshot ? orderSnapshot.total : total).toLocaleString()}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}