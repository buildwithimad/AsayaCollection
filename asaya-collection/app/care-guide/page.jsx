import Link from 'next/link';

export const metadata = {
  title: 'Care Guide | Asaya',
  description: 'Learn how to care for your luxury silhouettes.',
};

export default function CareGuide() {
  return (
    <main className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-24 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-[800px] mx-auto">
        
        <div className="text-center mb-24">
          <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-medium mb-4 block">
            The Maison
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
            Product Care Guide
          </h1>
          <p className="text-[#666] text-sm font-light leading-relaxed max-w-lg mx-auto">
            Our pieces are crafted to withstand the test of time. By following these simple care rituals, your Asaya silhouette will mature beautifully and remain a staple in your wardrobe for years to come.
          </p>
        </div>

        <div className="space-y-20">
          
          <section className="flex flex-col md:flex-row gap-6 md:gap-16 items-start border-t border-[#1a1a1a]/10 pt-10">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium w-full md:w-1/3 shrink-0 mt-1">
              Smooth & Textured Leather
            </h2>
            <div className="w-full md:w-2/3 text-[#666] text-sm font-light leading-loose space-y-4">
              <p>
                Leather is a natural material that evolves, softening and taking on a unique patina over time. To preserve its original beauty, protect your piece from prolonged exposure to direct sunlight, heat, and humidity.
              </p>
              <p>
                If your bag encounters water, gently dab it dry with a soft, lint-free, light-colored cloth. Avoid rubbing, as this can damage the grain. We recommend using a high-quality leather conditioner every few months to keep the material supple.
              </p>
            </div>
          </section>

          <section className="flex flex-col md:flex-row gap-6 md:gap-16 items-start border-t border-[#1a1a1a]/10 pt-10">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium w-full md:w-1/3 shrink-0 mt-1">
              Canvas & Woven Materials
            </h2>
            <div className="w-full md:w-2/3 text-[#666] text-sm font-light leading-loose space-y-4">
              <p>
                Our signature canvas and woven designs offer a relaxed elegance. To clean, use a soft, slightly damp cloth with a mild, neutral soap. Gently wipe in the direction of the weave.
              </p>
              <p>
                Take care to avoid contact with heavily dyed garments (like raw denim) as color transfer can occur on lighter fabrics. Keep woven bags away from abrasive surfaces to prevent snagging.
              </p>
            </div>
          </section>

          <section className="flex flex-col md:flex-row gap-6 md:gap-16 items-start border-t border-[#1a1a1a]/10 pt-10">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium w-full md:w-1/3 shrink-0 mt-1">
              Hardware & Storage
            </h2>
            <div className="w-full md:w-2/3 text-[#666] text-sm font-light leading-loose space-y-4">
              <p>
                The metallic hardware on your bag is treated to resist tarnishing. Polish it occasionally with a specialized jewelry cloth to restore its brilliant shine. Avoid using harsh chemical cleaners.
              </p>
              <p>
                When not in use, always store your silhouette in the complimentary dust bag provided at purchase. We recommend stuffing the interior with acid-free tissue paper to help the bag maintain its structured shape, and storing it standing upright in a cool, dry place.
              </p>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}