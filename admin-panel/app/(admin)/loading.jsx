'use client';

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#fdfbfb] overflow-hidden">
      
      <div className="relative flex flex-col items-center">
        
        {/* --- THE TRIPLE ORBIT SPINNER --- */}
        <div className="relative h-20 w-20 flex items-center justify-center">
          
          {/* Ring 1: The Fast Outer Stroke */}
          <div className="absolute inset-0 rounded-full border-[1px] border-transparent border-t-[#1a1a1a] animate-spin duration-[800ms]"></div>
          
          {/* Ring 2: The Slow Middle Ghost */}
          <div className="absolute h-[80%] w-[80%] rounded-full border-[1px] border-transparent border-l-[#1a1a1a]/20 border-r-[#1a1a1a]/20 animate-reverse-spin duration-[2500ms]"></div>
          
          {/* Ring 3: The Pulsing Core */}
          <div className="h-2 w-2 rounded-full bg-[#1a1a1a] animate-pulse"></div>

        </div>

        {/* --- BRANDING --- */}
        <div className="mt-10 flex flex-col items-center">
          <h2 className="text-sm font-light tracking-[0.6em] text-[#1a1a1a] uppercase translate-x-[0.3em]">
            Asaya
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-[1px] w-4 bg-[#1a1a1a]/10"></span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#888] font-medium">
              Loading...
            </span>
            <span className="h-[1px] w-4 bg-[#1a1a1a]/10"></span>
          </div>
        </div>

      </div>

      {/* Subtle Corner Detail */}
      <div className="absolute bottom-8 right-8 border-l border-t border-[#1a1a1a]/5 w-12 h-12"></div>

      {/* --- KEYFRAMES --- */}
      <style jsx>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 2.5s linear infinite;
        }
        .duration-800ms {
          animation-duration: 800ms;
        }
      `}</style>
    </div>
  );
}