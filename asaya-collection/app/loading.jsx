export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center bg-[#fdfbfb] animate-in fade-in duration-500">
      <div className="relative flex flex-col items-center gap-6">
        {/* The Spinner */}
        <div className="w-10 h-10 border-2 border-[#1a1a1a]/10 border-t-[#1a1a1a] rounded-full animate-spin"></div>
        
        {/* Boutique Text */}
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#1a1a1a]/60">
          Curating Collection...
        </span>
      </div>
    </div>
  );
}