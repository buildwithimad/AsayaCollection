'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      { q: "How long does shipping take?", a: "Orders are processed within 24 hours. Standard nationwide delivery typically takes 3-5 business days, while express delivery arrives in 1-2 business days." },
      { q: "Do you ship internationally?", a: "Currently, we offer shipping exclusively within the country. We are actively working on expanding our logistics to welcome international clients soon." },
      { q: "How can I track my order?", a: "Once your order is dispatched, you will receive an email with a tracking link. You can also view your order status by logging into your Account and visiting the Order History section." }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. Items must be unused, in their original condition, and with all tags and protective packaging intact to qualify for a refund." },
      { q: "How do I initiate a return?", a: "Please contact our Client Services team via the Contact page with your order number. We will provide you with a complimentary return shipping label and further instructions." }
    ]
  },
  {
    category: "Our Products",
    questions: [
      { q: "Where are your silhouettes crafted?", a: "Our pieces are thoughtfully designed in our atelier and crafted by skilled artisans using premium, ethically sourced materials to ensure longevity and elegance." },
      { q: "Does my bag come with a warranty?", a: "Yes, every Asaya piece includes a one-year warranty covering manufacturing defects. Please note that this does not cover natural wear and tear or improper care." }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-24 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-[800px] mx-auto">
        
        <div className="text-center mb-20">
          <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-medium mb-4 block">
            Client Services
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-[#666] text-sm font-light leading-relaxed max-w-md mx-auto">
            Find answers to common questions about our shipping, returns, and products. If you need further assistance, please <Link href="/contact" className="border-b border-[#1a1a1a] pb-0.5 text-[#1a1a1a] hover:opacity-60 transition-opacity">contact us</Link>.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {faqs.map((section, sIndex) => (
            <div key={sIndex}>
              <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#1a1a1a] mb-6 border-b border-[#1a1a1a]/10 pb-4">
                {section.category}
              </h2>
              <div className="flex flex-col">
                {section.questions.map((faq, qIndex) => {
                  const absoluteIndex = `${sIndex}-${qIndex}`;
                  const isOpen = openIndex === absoluteIndex;

                  return (
                    <div key={qIndex} className="border-b border-[#1a1a1a]/10">
                      <button 
                        onClick={() => toggleFAQ(absoluteIndex)}
                        className="w-full py-6 flex justify-between items-center text-left cursor-pointer group focus:outline-none"
                      >
                        <span className={`text-sm md:text-base font-light tracking-wide transition-colors duration-300 ${isOpen ? 'text-[#1a1a1a]' : 'text-[#666] group-hover:text-[#1a1a1a]'}`}>
                          {faq.q}
                        </span>
                        <span className="text-xl font-light text-[#1a1a1a] ml-4 shrink-0 transition-transform duration-500">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'}`}
                      >
                        <p className="text-sm font-light text-[#666] leading-relaxed pr-8">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}