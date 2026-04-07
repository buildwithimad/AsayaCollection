'use client';

const trustFeatures = [
  {
    id: 1,
    num: "01",
    title: "Cash on Delivery",
    description: "Pay conveniently at your doorstep for ultimate peace of mind.",
    icon: (
      <svg className="w-8 h-8 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 2,
    num: "02",
    title: "Premium Quality",
    description: "Crafted with the finest materials and meticulous attention to detail.",
    icon: (
      <svg className="w-8 h-8 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )
  },
  {
    id: 3,
    num: "03",
    title: "Easy Returns",
    description: "Enjoy a hassle-free 30-day return policy because your satisfaction matters.",
    icon: (
      <svg className="w-8 h-8 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    )
  },
  {
    id: 4,
    num: "04",
    title: "Fast Delivery",
    description: "Expedited shipping to get your new favorite piece to you swiftly.",
    icon: (
      <svg className="w-8 h-8 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    )
  }
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#fdfbfb]">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-20 md:mb-28">
        <span className="uppercase tracking-[0.3em] text-[#666] text-[10px] sm:text-xs font-medium mb-4 block">
          The Asaya Promise
        </span>
        <h2 className="text-[#1a1a1a] text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
          Why Choose Us
        </h2>
      </div>

      {/* Trust Features Grid - Seamless Editorial Look */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {trustFeatures.map((feature) => (
          <div 
            key={feature.id} 
            className="group relative flex flex-col pt-10 pb-8 px-6 bg-[#faeceb]/20 hover:bg-[#faeceb]/40 transition-colors duration-500"
          >
            {/* Animated Top Line Effect */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#1a1a1a]/10"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#1a1a1a] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>
            
            {/* Number Indicator */}
            <span className="absolute top-6 right-6 text-[#1a1a1a]/20 text-sm font-medium tracking-widest transition-colors duration-500 group-hover:text-[#1a1a1a]/40">
              / {feature.num}
            </span>

            {/* Content Container (Shifts right on hover) */}
            <div className="transform transition-transform duration-500 group-hover:translate-x-2">
              
              {/* Icon Container */}
              <div className="mb-10 text-[#1a1a1a]">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-[#1a1a1a] text-sm md:text-base uppercase tracking-[0.15em] font-medium mb-4">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-[#666] text-sm font-light leading-relaxed max-w-[220px]">
                {feature.description}
              </p>
              
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}