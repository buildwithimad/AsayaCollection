'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending an email (You can connect this to Resend later!)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-24 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-4 block">
            Client Services
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">Contact Us</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Contact Info */}
          <div className="w-full lg:w-1/3 flex flex-col gap-12">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#1a1a1a]">Customer Care</h3>
              <p className="text-[#666] text-sm font-light leading-relaxed mb-4">
                Our Client Advisors are available to assist you with styling advice, detailed product information, delivery questions, and exchange requests.
              </p>
              <a href="mailto:asayacollection83@gmail.com" className="text-sm font-medium border-b border-[#1a1a1a] pb-0.5 hover:text-[#e6b93d] hover:border-[#e6b93d] transition-colors">
                asayacollection83@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#1a1a1a]">Operating Hours</h3>
              <ul className="text-[#666] text-sm font-light space-y-2">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
              <p className="text-[10px] text-[#888] uppercase tracking-widest mt-4">Pakistan Standard Time (PKT)</p>
            </div>

            <div className="bg-[#faeceb]/30 border border-[#e5e5e5] p-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-2 text-[#1a1a1a]">Order Inquiries</h3>
              <p className="text-[#666] text-sm font-light leading-relaxed mb-4">
                Need to track or cancel a recent purchase? You can manage your orders directly through our guest portal.
              </p>
              <Link href="/orders" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a] hover:text-[#e6b93d] transition-colors">
                Track Order &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full lg:w-2/3">
            {isSuccess ? (
              <div className="bg-[#faf9f8] border border-[#e5e5e5] p-12 text-center h-full flex flex-col justify-center items-center">
                <svg className="w-12 h-12 stroke-[#1a1a1a] mb-6" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <h2 className="text-2xl font-light tracking-tight mb-4">Message Received</h2>
                <p className="text-[#666] text-sm font-light mb-8 max-w-md leading-relaxed">
                  Thank you for reaching out to Asaya Collection. One of our Client Advisors will reply to your email within 24 hours.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#1a1a1a] pb-1 hover:text-[#e6b93d] hover:border-[#e6b93d] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border border-[#e5e5e5] px-5 py-4 text-sm font-light placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border border-[#e5e5e5] px-5 py-4 text-sm font-light placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none"
                  />
                </div>
                
                <div className="relative">
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-transparent border border-[#e5e5e5] px-5 py-4 text-sm font-light text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none appearance-none cursor-pointer invalid:text-[#ccc]"
                  >
                    <option value="" disabled hidden>Select a Subject</option>
                    <option value="Order Tracking">Order Tracking & Delivery</option>
                    <option value="Returns">Returns & Exchanges</option>
                    <option value="Product Info">Product Information</option>
                    <option value="Wholesale">Wholesale & Press</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>

                <textarea 
                  placeholder="How can we help you today?" 
                  required
                  rows="6"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border border-[#e5e5e5] px-5 py-4 text-sm font-light placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] transition-colors rounded-none resize-none"
                ></textarea>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#1a1a1a] text-white px-12 py-5 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#e6b93d] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}