'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust path to your Supabase client
import Link from 'next/link';

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailAlert, setEmailAlert] = useState(''); // NEW: State for our custom alert

  useEffect(() => {
    setIsMounted(true);
  }, []);


const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // 🌟 We changed ?next=/orders to ?next=/ 
          // This tells the callback to send them to the Home Page!
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("Failed to log in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  // NEW: Function to handle the "Coming Soon" email alert
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailAlert('Email authentication is launching soon. Please continue with Google.');
    
    // Automatically hide the alert after 4 seconds
    setTimeout(() => {
      setEmailAlert('');
    }, 4000);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#fdfbfb] flex flex-col justify-center items-center px-6 pt-20 pb-20">
      
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-6 text-center">
          Client Account
        </span>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1a1a1a] mb-4 text-center">
          Sign In
        </h1>
        <p className="text-[#666] text-sm font-light mb-12 text-center leading-relaxed">
          Access your order history, manage your preferences, and experience a faster checkout.
        </p>

        {/* Login Container */}
        <div className="w-full bg-white border border-[#e5e5e5] p-8 md:p-12 flex flex-col gap-6 shadow-sm">
          
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center cursor-pointer gap-4 bg-white border border-[#e5e5e5] px-6 py-4 hover:bg-[#faf9f8] hover:border-[#1a1a1a]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {/* Minimalist Google 'G' Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-[#1a1a1a] group-hover:text-[#666] transition-colors">
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <span className="absolute w-full h-[1px] bg-[#e5e5e5]"></span>
            <span className="relative bg-white px-4 text-[10px] uppercase tracking-widest text-[#888] font-bold">
              Or
            </span>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit}>
            {/* Elegant Custom Alert */}
            {emailAlert && (
              <div className="bg-[#e6b93d]/10 border border-[#e6b93d]/30 px-4 py-3 text-center transition-all duration-300">
                <p className="text-xs text-[#c29623] font-medium tracking-wide">
                  {emailAlert}
                </p>
              </div>
            )}

            <input 
              type="email" 
              placeholder="Email address" 
              required
              className="w-full bg-transparent border border-[#e5e5e5] px-5 py-3.5 text-sm font-light placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all rounded-sm"
            />
            <button 
              type="submit" 
              className="w-full bg-[#1a1a1a] cursor-pointer text-white px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#e6b93d] transition-colors duration-500"
            >
              Continue with Email
            </button>
          </form>

        </div>

        {/* Footer Links */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-[#888]">
          <Link href="/collections" className="hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5">
            Return to Shop
          </Link>
          <span>|</span>
          <Link href="/orders" className="hover:text-[#1a1a1a] transition-colors border-b border-transparent hover:border-[#1a1a1a] pb-0.5">
            Guest Tracking
          </Link>
        </div>

      </div>
    </div>
  );
}