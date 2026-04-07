'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { name: 'Orders', href: '/orders', icon: 'M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9' },
    { name: 'Products', href: '/products', icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' },
    { name: 'Customers', href: '/customers', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { name: 'Settings', href: '/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <>
      {/* Mobile Overlay Background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#1a1a1a]/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel - Sharp Edges, Clean Lines */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#fdfbfb] border-r border-[#e5e5e5] transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] lg:translate-x-0 lg:static lg:flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-[#e5e5e5]">
          <Link href="/dashboard" className="block relative w-[120px] h-[35px] hover:opacity-70 transition-opacity duration-300">
            <Image src="/Logo.png" alt="Asaya Admin" fill className="object-contain" priority />
          </Link>
          
          {/* Mobile Close Button - Staggered Cross */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden relative w-6 h-6 flex items-center justify-center group"
          >
            <span className="absolute w-full h-px bg-[#1a1a1a] rotate-45 transition-transform duration-500 group-hover:scale-75"></span>
            <span className="absolute w-full h-px bg-[#1a1a1a] -rotate-45 transition-transform duration-500 group-hover:scale-75"></span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-2">
          <p className="px-4 text-[9px] uppercase tracking-[0.25em] text-[#888] font-bold mb-6">Directory</p>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                // Sharp borders, no rounded corners, elegant transitions
                className={`flex items-center gap-4 px-4 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-all duration-300 border-l ${
                  isActive 
                    ? 'bg-[#fce3de] border-[#1a1a1a] text-[#1a1a1a]' 
                    : 'border-transparent text-[#666] hover:bg-[#fce3de] hover:text-[#1a1a1a]'
                }`}
              >
                <svg className="w-[18px] h-[18px] stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area - Brutalist / Sharp Design */}
        <div className="p-6 border-t border-[#e5e5e5]">
          <div className="bg-white cursor-pointer  p-4 flex items-center gap-4 hover:bg-[#fce3de] hover:border-[#1a1a1a]/30 transition-colors cursor-default">
            {/* Square Avatar instead of circle */}
            <div className="w-8 h-8 bg-[#1a1a1a] text-white flex items-center justify-center text-[10px] rounded-full font-bold uppercase">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">Admin</span>
              <span className="text-[9px] text-[#888] tracking-wider mt-0.5">Control Panel</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}