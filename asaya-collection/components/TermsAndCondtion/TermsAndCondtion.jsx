'use client';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-32 font-sans">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* --- EDITORIAL HEADER --- */}
        <div className="mb-20 md:mb-32 flex flex-col items-center text-center">
          <span className="uppercase tracking-[0.4em] text-[#888] text-[9px] font-bold mb-6 block">
            Legal Directory
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8 font-serif">
            Terms & Conditions
          </h1>
          <div className="w-12 h-px bg-[#1a1a1a]/30 mb-6"></div>
          <p className="text-[#666] text-[10px] uppercase tracking-widest">
            Effective Date: April 2026
          </p>
        </div>

        {/* --- SPLIT-LAYOUT CONTENT --- */}
        <div className="space-y-20 md:space-y-32 text-[#555] text-sm md:text-base font-light leading-relaxed">
          
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 border-t border-[#e5e5e5] pt-12 md:pt-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                01. General Overview
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                Welcome to Asaya Collection. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our site and your relationship with us. If you do not agree with any part of these terms, please do not use our website.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                02. Products & Pricing
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                We strive to display our products as accurately as possible, including their colors and textures. However, we cannot guarantee that your device's display will accurately reflect the true color of the items. All prices are subject to change without prior notice. We reserve the right to modify or discontinue any product at any given time without liability.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                03. Orders & Cancellations
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="mb-6">
                When you place an order, you will receive an email confirmation. This email serves as an acknowledgment of your order request, not a legally binding contract of sale.
              </p>
              <div className="bg-[#faeceb]/30 border-l border-[#1a1a1a] p-6 text-[#1a1a1a]">
                <span className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-[#888]">Important Notice</span>
                <strong className="font-medium tracking-wide">12-Hour Cancellation Window:</strong> We offer a strict 12-hour cancellation window from the exact time your order is placed. You may cancel your order via your Account dashboard or the Guest Tracking portal within this timeframe. After 12 hours, the order is securely processed for dispatch and can no longer be amended or canceled.
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                04. Payment & Delivery
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                Our primary method of transaction is Cash on Delivery (COD). By selecting this method, you agree to pay the exact invoiced amount to our courier partner upon receipt of your package. Refusal to accept a COD order upon delivery without valid reason may result in restrictions on future purchases from our store. Delivery times are estimates and commence from the date of dispatch.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                05. Intellectual Property
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                All content on this website, including but not limited to photography, text, typography, graphics, logos, and digital downloads, is the exclusive intellectual property of Asaya Collection. Unauthorized use, reproduction, or distribution of this material is strictly prohibited and will be actively pursued through legal action.
              </p>
            </div>
          </section>

        </div>

        {/* --- FOOTER INQUIRY --- */}
        <div className="mt-24 md:mt-32 pt-12 border-t border-[#e5e5e5] text-center">
          <p className="text-xs text-[#888] font-light tracking-wide">
            For further clarification regarding our Terms & Conditions, please contact Client Services at <br className="md:hidden" />
            <a 
              href="mailto:asayacollection83@gmail.com" 
              className="text-[#1a1a1a] border-b border-[#1a1a1a]/30 hover:border-[#1a1a1a] transition-colors ml-1"
            >
              asayacollection83@gmail.com
            </a>.
          </p>
        </div>

      </div>
    </div>
  );
}