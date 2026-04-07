'use client';


export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-32 font-sans">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* --- EDITORIAL HEADER --- */}
        <div className="mb-20 md:mb-32 flex flex-col items-center text-center">
          <span className="uppercase tracking-[0.4em] text-[#888] text-[9px] font-bold mb-6 block">
            Legal Directory
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8 font-serif">
            Privacy Policy
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
                01. Introduction
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                At Asaya Collection ("we", "our", "us"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from our boutique.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                02. Information Collection
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="mb-6">We collect information that you explicitly provide to us during your interaction with our store, including:</p>
              <ul className="space-y-4 pl-5 list-disc marker:text-[#ccc]">
                <li><strong className="text-[#1a1a1a] font-medium">Contact Information:</strong> Your full name, email address, phone number, and physical shipping/billing address.</li>
                <li><strong className="text-[#1a1a1a] font-medium">Account Details:</strong> Should you choose to create an account, we securely store your authentication credentials.</li>
                <li><strong className="text-[#1a1a1a] font-medium">Order History:</strong> Records of the items you have purchased, saved, or inquired about.</li>
              </ul>
              <div className="mt-8 bg-[#faf9f8] p-6 text-[#1a1a1a] text-sm">
                <span className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 text-[#888]">Data Security Note</span>
                As our primary transaction method is Cash on Delivery (COD), we do not request, process, or store sensitive credit card or bank account information on our servers.
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                03. Usage of Data
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="mb-6">The information we collect is utilized strictly to elevate your experience with Asaya Collection:</p>
              <ul className="space-y-4 pl-5 list-disc marker:text-[#ccc]">
                <li>To process, fulfill, and dispatch your orders with absolute precision.</li>
                <li>To communicate transactional updates, including order confirmations and delivery tracking.</li>
                <li>To provide dedicated support through our Client Services team.</li>
                <li>To send curated editorial newsletters and exclusive collection previews (only if you have explicitly opted in). You retain the right to unsubscribe instantly at any time.</li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                04. Data Sharing
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                Asaya Collection strictly does not sell, trade, or rent your personal information to third parties. We only share necessary data with trusted service partners required to fulfill our obligations to you—namely, our secure courier networks for physical delivery and our encrypted email infrastructure for sending your purchase receipts.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-4">
              <h2 className="text-xl md:text-2xl text-[#1a1a1a] font-light font-serif md:sticky md:top-32">
                05. Your Rights
              </h2>
            </div>
            <div className="md:col-span-8">
              <p>
                You possess absolute ownership over your personal data. You maintain the right to access, rectify, or permanently delete your information from our systems at any time. Registered clients may manage these details directly via their Account dashboard. For guest checkout data removal, simply contact our Client Services concierge.
              </p>
            </div>
          </section>

        </div>

        {/* --- FOOTER INQUIRY --- */}
        <div className="mt-24 md:mt-32 pt-12 border-t border-[#e5e5e5] text-center">
          <p className="text-xs text-[#888] font-light tracking-wide">
            For inquiries regarding our data practices or to exercise your privacy rights, please contact us at <br className="md:hidden" />
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