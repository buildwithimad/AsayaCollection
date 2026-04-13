'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa6';

export default function CustomersUI({ initialCustomers, totalCount, currentPage, currentSearch, limit }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);

  const totalPages = Math.ceil(totalCount / limit);

  const updateFilters = (newPage = 1) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    if (search) params.set('search', search); else params.delete('search');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateFilters(1);
  };

  const clearFilters = () => {
    setSearch('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  // Helper to extract initials for the luxury avatar
  const getInitials = (name) => {
    if (!name || name === 'Guest User') return 'G';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={`flex flex-col gap-8 text-slate-700 font-sans font-light min-h-screen p-2 md:p-8 transition-opacity duration-500 ${isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl text-slate-950 font-normal tracking-tight">Client Directory</h1>
            {isPending && <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#fa8791]"></div>}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-light">
            Manage your boutique's established clientele ({totalCount} total buyers)
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1 space-y-2">
            <label className="text-xs font-medium text-slate-500 ml-1 italic font-serif">Search Directory</label>
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 text-sm font-light text-slate-800 focus:outline-none focus:bg-white focus:border-[#fce3de] focus:ring-4 focus:ring-[#fce3de]/30 transition-all rounded-2xl placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button type="submit" disabled={isPending} className="bg-[#fce3de] text-slate-700 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] hover:bg-[#fa8791] hover:text-white transition-all duration-300 rounded-2xl cursor-pointer disabled:bg-slate-400">
              Filter
            </button>
            {currentSearch && (
              <button type="button" onClick={clearFilters} className="bg-white text-slate-600 border border-slate-200 px-6 py-3.5 text-xs font-medium uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#fdfaf9] border-b border-[#fce3de]/50 text-xs font-medium text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6 font-medium">Client Profile</th>
                <th className="px-5 py-6 font-medium text-center">Purchases</th>
                <th className="px-5 py-6 font-medium">Lifetime Value</th>
                <th className="px-5 py-6 font-medium">Last Acquisition</th>
                <th className="px-8 py-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-slate-700">
              {initialCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 mb-4 stroke-slate-300 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      {currentSearch ? (
                        <>
                          <p className="text-sm text-slate-700 font-medium uppercase tracking-widest">No Matches Found</p>
                          <p className="text-xs text-slate-400 mt-2 max-w-sm">
                            We couldn't find any VIP clients matching <span className="font-semibold text-slate-600">"{currentSearch}"</span>.
                          </p>
                          <button onClick={clearFilters} className="mt-6 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors cursor-pointer border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-full">
                            Clear Search
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">No VIP Clients Yet</p>
                          <p className="text-xs text-slate-400 mt-2">Clients with more than 3 purchases will appear here.</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                initialCustomers.map((client) => (
                  <tr key={client.email} className="border-b border-slate-50 last:border-none hover:bg-[#fdfaf9]/50 transition-colors group">
                    
                    {/* CLIENT PROFILE */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-[#fce3de] flex items-center justify-center text-sm font-bold tracking-widest flex-shrink-0 shadow-inner">
                          {getInitials(client.name)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-slate-900">{client.name}</span>
                          <span className="text-[11px] text-slate-400">{client.email}</span>
                          
                          {client.phone && (
                            <a 
                              href={`https://wa.me/${client.phone.replace(/\D/g, '').replace(/^(?:92|0)?/, '92')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-1 flex items-center gap-1.5 text-[#075E54] hover:text-[#25D366] transition-colors w-fit"
                              title={`Message ${client.phone}`}
                            >
                              <FaWhatsapp className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold tracking-wide">{client.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* PURCHASES */}
                    <td className="px-5 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 font-medium text-slate-700 text-xs">
                        {client.total_orders}
                      </span>
                    </td>

                    {/* LIFETIME VALUE */}
                    <td className="px-5 py-5">
                      <span className="font-normal text-slate-900 text-base">
                        Rs. {client.total_spent.toLocaleString()}
                      </span>
                    </td>

                    {/* LAST ACQUISITION */}
                    <td className="px-5 py-5 text-slate-500 font-light">
                      {new Date(client.last_order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {
                           startTransition(() => router.push(`/orders?search=${encodeURIComponent(client.email)}`));
                        }}
                        className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all opacity-100 lg:opacity-0 group-hover:opacity-100"
                      >
                        View Orders
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-3xl p-6 ">
          <p className="text-sm text-slate-500 font-light">Page <span className="text-slate-900 font-normal">{currentPage}</span> of <span className="text-slate-900 font-normal">{totalPages}</span></p>
          <div className="flex gap-3">
            <button onClick={() => updateFilters(currentPage - 1)} disabled={currentPage === 1 || isPending} className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 text-xs font-medium uppercase rounded-xl disabled:opacity-40 cursor-pointer">Prev</button>
            <button onClick={() => updateFilters(currentPage + 1)} disabled={currentPage === totalPages || isPending} className="bg-black text-white px-6 py-2.5 text-xs font-medium uppercase rounded-xl disabled:opacity-40 shadow-sm cursor-pointer hover:bg-[#fa8791] transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}