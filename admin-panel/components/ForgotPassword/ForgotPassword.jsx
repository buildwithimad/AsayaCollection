'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordUI({ forgotPasswordAction }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [hostname, setHostname] = useState('secure.asaya.internal');

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Capture the target element immediately
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await forgotPasswordAction(formData);
      
      if (result && !result.success) {
        if (result.message?.toLowerCase().includes('rate limit')) {
          setError("Security rate limit reached. Please wait 1 hour before requesting another link.");
        } else {
          setError(result.message);
        }
      } else if (result.success) {
        // 🌟 FIX: Reset the form BEFORE showing the success message
        form.reset(); 
        setSuccessMsg(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center w-full px-5 py-12 md:py-20 bg-[#fdfbfb] min-h-screen">
      
      <div className="w-full max-w-[480px] flex flex-col items-center">
        
        {/* --- Admin Branding --- */}
        <div className="flex flex-col items-center mb-12 md:mb-16 text-center w-full">
          <div className="relative w-[200px] h-[60px] sm:w-[240px] sm:h-[70px] mb-10 transition-all duration-300">
            <Image 
              src="/Logo.png" 
              alt="Asaya Official Logo" 
              fill
              className="object-contain opacity-90"
              priority
            />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#1a1a1a]/20"></span>
            <span className="uppercase tracking-[0.4em] text-[#1a1a1a] text-[10px] font-bold block">
              Access Recovery
            </span>
            <span className="w-8 h-px bg-[#1a1a1a]/20"></span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1a1a1a] font-serif leading-tight">
            Reset Password
          </h1>
          <p className="text-sm text-[#666] font-light mt-3 px-6">
            Enter your email address and we will send you a secure link to reset your administrative access.
          </p>
        </div>

        {/* --- Recovery Box --- */}
        <div className="w-full p-7 sm:p-10 md:p-12 transition-all duration-300">
          
          {error && (
            <div className="mb-8 p-4 border-l-2 border-[#b33a3a] bg-[#b33a3a]/5 transition-all animate-in fade-in">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-[#b33a3a]">
                Error: {error}
              </p>
            </div>
          )}

          {successMsg && (
            <div className="mb-8 p-4 border-l-2 border-[#2b8a3e] bg-[#e6f4ea] transition-all animate-in fade-in">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-[#2b8a3e]">
                {successMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            
            <div className="space-y-2.5">
              <label 
                htmlFor="email" 
                className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#666]"
              >
                Email Address
              </label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                placeholder="admin@asayacollection.com"
                className="w-full bg-[#faf9f8] border border-[#e5e5e5] px-5 py-4 text-sm font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:bg-white focus:ring-1 focus:ring-[#fce3de]/10 transition-all duration-300 rounded-none"
                autoComplete="email"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || successMsg}
              className="w-full mt-3 bg-[#1a1a1a] text-white px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#333] active:bg-black transition-colors cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-sm rounded-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Secure Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
            
            <div className="text-center mt-2">
              <Link 
                href="/" 
                className="text-[10px] uppercase tracking-widest font-bold text-[#666] hover:text-[#1a1a1a] transition-colors"
              >
                &larr; Return to Login
              </Link>
            </div>

          </form>
        </div>

        {/* --- Security Footer --- */}
        <div className="mt-8 text-center w-full px-6">
          <p className="text-[10px] uppercase tracking-widest text-[#aaa] flex items-center justify-center gap-2.5 leading-relaxed">
            <svg className="w-3.5 h-3.5 stroke-current flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Terminal ID: {hostname}
          </p>
        </div>

      </div>
    </div>
  );
}