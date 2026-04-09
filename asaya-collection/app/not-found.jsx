import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Asaya',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] flex flex-col items-center justify-center px-6 md:px-12 text-center font-sans relative overflow-hidden">
      
      {/* Subtle, oversized background watermark for editorial feel */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[15rem] md:text-[25rem] lg:text-[30rem] font-extralight text-[#1a1a1a] opacity-[0.02] tracking-tighter">
          404
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-medium mb-6 block">
          Error 404
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
          Page Not Found
        </h1>
        
        <p className="text-[#666] text-sm font-light leading-relaxed max-w-md mx-auto mb-12">
          The piece, collection, or page you are looking for has been archived, moved, or is no longer available in our online boutique.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            href="/collections"
            className="bg-[#1a1a1a] text-[#fdfbfb] px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#333] transition-colors shadow-lg shadow-[#1a1a1a]/10"
          >
            Explore Collection
          </Link>
          
          <Link 
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a] border-b border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </div>
      
    </main>
  );
}