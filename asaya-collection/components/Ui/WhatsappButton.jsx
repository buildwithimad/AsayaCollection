'use client';

import { FaWhatsapp } from 'react-icons/fa6';

export default function WhatsAppButton() {
  // 🌟 Replace this with your actual business phone number (include country code, no + or spaces)
  const phoneNumber = "923129940342"; 
  
  // 🌟 Optional: A pre-filled message to make it easy for the client
  const prefilledMessage = "Hello! I would like to inquire about an Asaya piece.";
  
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group flex items-center gap-4">
      
      {/* --- DESKTOP TOOLTIP --- */}
      {/* Slides in from the right when hovering over the button */}
      <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 px-4 py-2 bg-[#fdfbfb] text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg shadow-[#1a1a1a]/5 border border-[#1a1a1a]/10 pointer-events-none hidden md:block">
        Whatsapp
      </div>

      {/* --- MAIN BUTTON --- */}
      <a 
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Client Services on WhatsApp"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-green-600 text-[#fdfbfb] rounded-full shadow-xl shadow-[#1a1a1a]/20 hover:bg-green-700 hover:scale-105 transition-all duration-300"
      >
        <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
      </a>
      
    </div>
  );
}