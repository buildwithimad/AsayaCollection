import Link from 'next/link';

export const metadata = {
  title: 'Cookie Preferences | Asaya',
};

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[#fdfbfb] text-[#1a1a1a] pt-32 pb-24 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-[700px] mx-auto">
        
        <div className="mb-16">
          <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-medium mb-4 block">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
            Cookie Policy
          </h1>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-medium">
            Last Updated: April 2026
          </p>
        </div>

        <div className="text-sm font-light text-[#4a4a4a] leading-loose space-y-8">
          
          <section>
            <h2 className="text-base text-[#1a1a1a] font-normal mb-3">1. Introduction</h2>
            <p>
              At Asaya, we believe in transparency and respecting your digital privacy. This Cookie Policy explains how and why we use cookies, and similar tracking technologies when you visit our website. By continuing to browse our boutique, you consent to the use of cookies as described below.
            </p>
          </section>

          <section>
            <h2 className="text-base text-[#1a1a1a] font-normal mb-3">2. What are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, provide a personalized shopping experience, and supply analytical information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-base text-[#1a1a1a] font-normal mb-3">3. How We Use Cookies</h2>
            <p className="mb-4">We categorize our cookies into three main types:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong className="text-[#1a1a1a] font-medium">Essential Cookies:</strong> Strictly necessary for the basic functionality of the website, such as allowing you to log into your account and securely process your shopping cart.
              </li>
              <li>
                <strong className="text-[#1a1a1a] font-medium">Performance & Analytics:</strong> These help us understand how clients interact with our website by collecting anonymous data. This allows us to improve our design and user experience.
              </li>
              <li>
                <strong className="text-[#1a1a1a] font-medium">Preferences & Marketing:</strong> These cookies remember your choices (such as language or currency) and help us deliver relevant editorial content and product recommendations tailored to your style.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base text-[#1a1a1a] font-normal mb-3">4. Managing Your Preferences</h2>
            <p>
              You have the right to accept or decline cookies. You can modify your browser settings to decline cookies if you prefer. Please note that if you choose to disable essential cookies, certain luxury features of our website, including the shopping cart and secure checkout, may not function properly.
            </p>
          </section>

          <section className="border-t border-[#1a1a1a]/10 pt-8 mt-12">
            <p className="text-xs">
              If you have any questions regarding our use of cookies or your digital privacy, please reach out to our privacy team via our <Link href="/contact" className="border-b border-[#1a1a1a] text-[#1a1a1a] hover:opacity-60 transition-opacity">Contact page</Link>.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}