'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { deleteOrderAction, updateOrderStatusAction } from '@/app/action/ordersService'; // 🌟 Import the update action!

export default function OrdersUI({ 
  initialOrders, 
  totalCount, 
  currentPage, 
  currentSearch, 
  currentStart, 
  currentEnd 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- FILTER STATES ---
  const [search, setSearch] = useState(currentSearch);
  const [start, setStart] = useState(currentStart);
  const [end, setEnd] = useState(currentEnd);
  
  // --- ACTION STATES ---
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); // 🌟 Tracks which order is updating

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const updateFilters = (newPage = 1) => {
    const params = new URLSearchParams(searchParams);
    
    params.set('page', newPage);
    if (search) params.set('search', search); else params.delete('search');
    if (start) params.set('start', start); else params.delete('start');
    if (end) params.set('end', end); else params.delete('end');

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateFilters(1); 
  };

  const clearFilters = () => {
    setSearch('');
    setStart('');
    setEnd('');
    router.push(pathname); 
  };

  const executeDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    
    const result = await deleteOrderAction(orderToDelete.id);
    
    setIsDeleting(false);
    if (result.success) {
      setOrderToDelete(null);
      router.refresh(); 
    } else {
      alert("Error deleting order: " + result.message);
    }
  };

  // 🌟 NEW: Handle Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    
    const result = await updateOrderStatusAction(orderId, newStatus);
    
    setUpdatingStatus(null);
    if (result.success) {
      router.refresh(); // Refresh to show the new status color
    } else {
      alert("Failed to update status: " + result.message);
    }
  };

  const inputStyles = "w-full bg-slate-50 border border-slate-200 px-5 py-3.5 text-sm font-light text-slate-800 focus:outline-none focus:bg-white focus:border-[#fce3de] focus:ring-4 focus:ring-[#fce3de]/30 transition-all rounded-2xl placeholder:text-slate-400";
  const actionIconStyles = "p-2.5 text-slate-400 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50";

  return (
    <div className="flex flex-col gap-8 text-slate-700 font-sans font-light bg-[#fdfbfb] min-h-screen p-2 md:p-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl text-slate-950 font-normal tracking-tight">Order Directory</h1>
          <p className="text-sm text-slate-500 mt-1 font-light">Monitor and fulfill customer acquisitions</p>
        </div>
      </div>

      {/* LUXURY DELETE WARNING MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center transform transition-all">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-normal text-slate-900 mb-2">Delete Order?</h2>
            <p className="text-sm text-slate-500 font-light mb-8 leading-relaxed">
              Are you sure you want to permanently delete order <span className="font-medium text-slate-800 font-mono tracking-wide">#{orderToDelete.order_number || orderToDelete.id.slice(0, 8).toUpperCase()}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4 w-full">
              <button onClick={() => setOrderToDelete(null)} disabled={isDeleting} className="flex-1 py-3.5 text-sm font-light text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                Keep Order
              </button>
              <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-3.5 text-sm font-normal text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center">
                {isDeleting ? <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> : 'Yes, Delete It'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="flex flex-col lg:flex-row gap-6 items-end">
          <div className="w-full lg:w-1/3 space-y-2">
            <label className="text-xs font-medium text-slate-500 ml-1 italic font-serif">Universal Search</label>
            <input type="text" placeholder="Order ID, Name, or Email..." value={search} onChange={(e) => setSearch(e.target.value)} className={inputStyles} />
          </div>
          <div className="w-full lg:w-1/4 space-y-2">
            <label className="text-xs font-medium text-slate-500 ml-1 italic font-serif">Start Date</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputStyles} />
          </div>
          <div className="w-full lg:w-1/4 space-y-2">
            <label className="text-xs font-medium text-slate-500 ml-1 italic font-serif">End Date</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={inputStyles} />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button type="submit" className="bg-black text-white px-8 py-4 text-xs font-medium uppercase tracking-[0.1em] hover:bg-[#fa8791] transition-all duration-300 rounded-2xl cursor-pointer shadow-lg shadow-black/10 active:scale-95">Filter</button>
            {(currentSearch || currentStart || currentEnd) && (
              <button type="button" onClick={clearFilters} className="bg-white text-slate-600 border border-slate-200 px-6 py-4 text-xs font-medium uppercase tracking-widest hover:bg-slate-50 transition-colors rounded-2xl cursor-pointer active:scale-95">Clear</button>
            )}
          </div>
        </form>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#fdfaf9] border-b border-[#fce3de]/50 text-xs font-medium text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6 font-medium w-24">Item</th>
                <th className="px-5 py-6 font-medium">Order Ref</th>
                <th className="px-5 py-6 font-medium">Acquisition Date</th>
                <th className="px-5 py-6 font-medium">Client Profile</th>
                <th className="px-5 py-6 font-medium">Revenue</th>
                <th className="px-5 py-6 font-medium">Status</th>
                <th className="px-8 py-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-slate-700">
              {initialOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center text-slate-400 font-light italic">No orders found matching your criteria.</td>
                </tr>
              ) : (
                initialOrders.map((order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const firstItem = items[0] || {};
                  const itemImg = firstItem.image || firstItem.thumbnail || firstItem.featured_image;
                  
                  // Ensure status defaults nicely if it's null/empty
                  const currentStatus = order.status || 'Order Placed';

                  return (
                    <tr key={order.id} className="border-b border-slate-50 last:border-none hover:bg-[#fdfaf9]/50 transition-colors group">
                      
                      <td className="px-8 py-6">
                        <div className="w-14 h-20 bg-slate-50 rounded-[10px] relative overflow-hidden flex items-center justify-center flex-shrink-0 border border-[#fce3de]/30 shadow-inner">
                          {itemImg ? (
                            <Image src={itemImg} alt="Order Item" fill className="object-cover" sizes="56px" />
                          ) : (
                            <svg className="w-5 h-5 stroke-[#fa8791]/50" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-6 font-normal text-slate-900 tracking-wide font-mono text-xs">
                        #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                      </td>
                      
                      <td className="px-5 py-6 text-slate-500 font-light">
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      
                      <td className="px-5 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-normal text-slate-800">{order.customer_name || 'Guest User'}</span>
                          <span className="text-xs text-slate-400">{order.email || order.customer_email || 'No email provided'}</span>
                        </div>
                      </td>
                      
                      <td className="px-5 py-6 font-normal text-slate-900 text-base tracking-tight">
                        Rs. {order.total_amount?.toLocaleString() || '0'}
                      </td>
                      
                      <td className="px-5 py-6">
                        {/* 🌟 INLINE STATUS DROPDOWN */}
                        <div className="relative inline-block">
                          {updatingStatus === order.id ? (
                             <span className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-widest rounded-full border bg-slate-50 text-slate-400 border-slate-200">
                               <svg className="animate-spin h-3 w-3 text-slate-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                               Updating...
                             </span>
                          ) : (
                            <>
                              <select 
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`appearance-none outline-none cursor-pointer inline-flex items-center pl-4 pr-8 py-2 text-[10px] font-semibold uppercase tracking-widest rounded-full border transition-all
                                  ${currentStatus === 'Completed' || currentStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 
                                    currentStatus === 'Canceled' ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' : 
                                    'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'}`}
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Completed">Completed</option>
                              </select>
                              {/* Custom Dropdown Arrow */}
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className={`w-3 h-3 ${currentStatus === 'Completed' || currentStatus === 'Delivered' ? 'text-emerald-600' : currentStatus === 'Canceled' ? 'text-rose-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                              </div>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                          <Link href={`/orders/${order.id}`} className={`${actionIconStyles} hover:text-[#fa8791]`} title="View Order Details">
                            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </Link>

                          <button onClick={() => setOrderToDelete(order)} className={`${actionIconStyles} hover:text-rose-600 hover:bg-rose-50`} title="Delete Order">
                            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-slate-500 font-light">
            Page <span className="text-slate-900 font-normal">{currentPage}</span> of <span className="text-slate-900 font-normal">{totalPages}</span>
          </p>
          <div className="flex gap-3">
            <button onClick={() => updateFilters(currentPage - 1)} disabled={currentPage === 1} className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-xl cursor-pointer">Prev</button>
            <button onClick={() => updateFilters(currentPage + 1)} disabled={currentPage === totalPages} className="bg-black text-white px-6 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-[#fa8791] transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-sm">Next</button>
          </div>
        </div>
      )}

    </div>
  );
}