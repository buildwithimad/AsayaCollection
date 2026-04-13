'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function UpdatePasswordUI({ setRecoveredPassword }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [hostname, setHostname] = useState('secure.asaya.internal');

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    // 🌟 1. Capture the form immediately before any async code runs
    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = formData.get('password');
    const confirm = formData.get('confirm');

    // Client-side validation: Check if passwords match first
    if (password !== confirm) {
      setError("Your new passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await setRecoveredPassword(formData);
      
      if (result && !result.success) {
        setError(result.message);
      } else if (result.success) {
        // 🌟 2. Reset the captured form BEFORE showing the success UI
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

  // Eye Icon SVG Helper
  const EyeIcon = ({ isVisible }) => (
    <svg className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      {isVisible ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  );

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
              Identity Verification
            </span>
            <span className="w-8 h-px bg-[#1a1a1a]/20"></span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1a1a1a] font-serif leading-tight">
            Create New Password
          </h1>
          <p className="text-sm text-[#666] font-light mt-3 px-6">
            Please enter a strong password to secure your administrative account.
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

          {successMsg ? (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#2b8a3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#1a1a1a] mb-2">{successMsg}</h3>
              <p className="text-sm text-[#666] font-light mb-8">Your account is now secure. Please log in with your new credentials.</p>
              
              {/* 🌟 Updated to go back to Login */}
              <Link 
                href="/login" 
                className="w-full inline-block bg-[#1a1a1a] text-white px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#333] transition-colors cursor-pointer"
              >
                Return to Login &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              
              <div className="space-y-2.5">
                <label 
                  htmlFor="password" 
                  className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#666]"
                >
                  New Password
                </label>
                <div className="relative">
                  <input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••••••••"
                    className="w-full bg-[#faf9f8] border border-[#e5e5e5] px-5 py-4 pr-12 text-sm font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a]/10 transition-all duration-300 rounded-none tracking-widest"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none"
                  >
                    <EyeIcon isVisible={showPassword} />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <label 
                  htmlFor="confirm" 
                  className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#666]"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"} 
                    required
                    placeholder="••••••••••••••"
                    className="w-full bg-[#faf9f8] border border-[#e5e5e5] px-5 py-4 pr-12 text-sm font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a]/10 transition-all duration-300 rounded-none tracking-widest"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirm(!showConfirm)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none"
                  >
                    <EyeIcon isVisible={showConfirm} />
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-3 bg-[#1a1a1a] text-white px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#333] active:bg-black transition-colors cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-sm rounded-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Securing Account...
                  </>
                ) : (
                  'Confirm New Password'
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
          )}
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