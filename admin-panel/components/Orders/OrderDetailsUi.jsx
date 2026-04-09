'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { updateOrderStatusAction } from '@/app/action/ordersService'; // 🌟 Import update action

export default function OrderDetailsUI({ order }) {
  const router = useRouter();
  
  // 🌟 State for loading spinner during status update
  const [isUpdating, setIsUpdating] = useState(false);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
  };

  const orderDate = new Date(order.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const orderItems = Array.isArray(order.items) ? order.items : [];
  
  // Default to 'Order Placed' if status is missing
  const currentStatus = order.status || 'Order Placed';

  // 🌟 Handle Status Change
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    const result = await updateOrderStatusAction(order.id, newStatus);
    setIsUpdating(false);
    
    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to update status: " + result.message);
    }
  };

  return (
    // Added print:block and print:bg-white to ensure it looks good on paper
    <div className="flex flex-col gap-8 print:block print:w-full print:bg-white">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e5e5e5] pb-6 gap-4 print:border-b-2 print:border-black">
        
        <div className="flex items-start gap-5">
          <div>
            {/* 🌟 print:hidden hides this link on the paper */}
            <Link 
              href="/orders" 
              className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#888] hover:text-[#1a1a1a] transition-colors flex items-center gap-2 mb-4 print:hidden"
            >
              &larr; Back to Directory
            </Link>
            <h1 className="text-3xl font-light text-[#1a1a1a] font-serif tracking-tight print:text-4xl print:text-black">
              Order {order.order_number || order.id?.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mt-2 print:text-black">
              Placed on {orderDate}
            </p>
          </div>
        </div>

        {/* 🌟 print:hidden hides the action buttons on the paper */}
        <div className="flex gap-3 print:hidden">
          <button 
            onClick={() => window.print()} 
            className="bg-[#1a1a1a] text-white rounded-xl cursor-pointer border border-[#1a1a1a] px-8 py-3 text-[9px] uppercase tracking-[0.25em] font-bold hover:bg-[#333] transition-colors shadow-sm active:scale-95"
          >
            Print Invoice
          </button>
        </div>
      </div>

      {/* --- INFORMATION GRIDS --- */}
      {/* 🌟 print:shadow-none removes the 3D box shadows on paper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
        
        <div className="bg-white border border-[#e5e5e5] p-6 rounded-xl print:shadow-none print:p-4 print:rounded-none">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] border-b border-[#e5e5e5] pb-3 mb-4 print:text-black">
            Customer Profile
          </h2>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-[#1a1a1a] print:text-black">{order.customer_name}</p>
            <p className="text-xs font-light text-[#666] tracking-wide print:text-black">{order.email || 'No email provided'}</p>
            <p className="text-xs font-light text-[#666] tracking-wide print:text-black">{order.phone}</p>
            
          {/* 🌟 ADDED WHATSAPP BUTTON HERE */}
            {order.phone && (
              <a 
                href={`https://wa.me/${order.phone.replace(/\D/g, '').replace(/^(?:92|0)?/, '92')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#075E54] border border-[#25D366]/20 px-4 py-2 rounded-md hover:bg-[#25D366]/20 transition-colors w-fit group print:hidden cursor-pointer"
                title="Message on WhatsApp"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.479-1.639-1.653-1.937-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span className="text-[10px] font-bold tracking-wide uppercase">Contact WhatsApp</span>
              </a>
            )}
            
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-6 rounded-xl print:shadow-none print:p-4 print:rounded-none">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] border-b border-[#e5e5e5] pb-3 mb-4 print:text-black">
            Shipping Address
          </h2>
          <div className="flex flex-col gap-1.5 text-xs font-light text-[#666] leading-relaxed print:text-black">
            <p>{order.address}</p>
            {order.landmark && <p>Landmark: {order.landmark}</p>}
            <p>{order.city}, {order.province} {order.zipcode}</p>
            <p>{order.country}</p>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-6 rounded-xl print:shadow-none print:p-4 print:rounded-none">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] border-b border-[#e5e5e5] pb-3 mb-4 print:text-black">
            Order Status
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#888] block mb-2 print:text-black">Current State</span>
              
              {/* 🌟 INLINE STATUS DROPDOWN */}
              {isUpdating ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 border text-[9px] uppercase tracking-[0.2em] font-bold rounded-none bg-slate-50 text-slate-400 border-slate-200">
                  <svg className="animate-spin h-3 w-3 text-slate-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Updating...
                </span>
              ) : (
                <div className="relative inline-block print:hidden">
                  <select 
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`appearance-none outline-none cursor-pointer inline-flex items-center pl-3 pr-8 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] border transition-all rounded-xl
                      ${currentStatus === 'Completed' || currentStatus === 'Delivered' ? 'bg-[#e6f4ea] border-[#e6f4ea] text-[#2b8a3e] hover:bg-[#d3ebd9]' : 
                        currentStatus === 'Canceled' ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' : 
                        'bg-[#fff3bf] border-[#fff3bf] text-[#e67700] hover:bg-[#ffebb3]'}`}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-3 h-3 ${currentStatus === 'Completed' || currentStatus === 'Delivered' ? 'text-[#2b8a3e]' : currentStatus === 'Canceled' ? 'text-rose-700' : 'text-[#e67700]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              )}
              
              {/* 🌟 Print-only static text */}
              <span className="hidden print:inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-black border border-black px-2 py-1">
                {currentStatus}
              </span>

            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#888] block mb-1 print:text-black">System ID</span>
              <p className="text-xs font-mono text-[#1a1a1a] truncate print:text-black">{order.id}</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- LINE ITEMS TABLE --- */}
      <div className="bg-white border border-[#e5e5e5] rounded-xl mt-2 print:shadow-none print:border-none print:rounded-none">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] border-b border-[#e5e5e5] p-6 bg-[#faf9f8] print:bg-white print:text-black print:px-0 print:border-b-2 print:border-black">
          Purchased Items
        </h2>
        
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse min-w-[700px] print:min-w-full">
            <thead>
              <tr className="border-b border-[#e5e5e5] text-[9px] uppercase tracking-[0.2em] text-[#888] print:text-black print:border-black">
                <th className="px-6 py-4 font-bold w-20 print:hidden">Item</th>
                <th className="px-4 py-4 font-bold print:px-0">Details</th>
                <th className="px-6 py-4 font-bold text-right">Price</th>
                <th className="px-6 py-4 font-bold text-center">Qty</th>
                <th className="px-6 py-4 font-bold text-right print:px-0">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-[#1a1a1a] print:text-black">
              
              {orderItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-[#888] text-xs">
                    No items found in JSON array.
                  </td>
                </tr>
              ) : (
                orderItems.map((item, idx) => {
                  const itemImg = item.image || item.thumbnail || item.featured_image;

                  return (
                    <tr key={idx} className="border-b border-[#e5e5e5] hover:bg-[#faf9f8] transition-colors print:bg-white print:border-b print:border-gray-300">
                      
                      <td className="px-6 py-4 print:hidden">
                        <div className="w-12 h-16 border border-[#e5e5e5] bg-white relative overflow-hidden flex-shrink-0">
                          {itemImg && (
                            <Image src={itemImg} alt="Product Item" fill className="object-cover" sizes="48px"/>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-5 print:px-0">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name || item.title || item.product_name || 'Item'}</span>
                          {(item.size || item.color) && (
                            <span className="text-[10px] text-[#888] tracking-wider mt-1 uppercase print:text-[#666]">
                              {item.color} {item.color && item.size ? '|' : ''} {item.size}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right tracking-wide">{formatMoney(item.price)}</td>
                      <td className="px-6 py-5 text-center">{item.quantity || 1}</td>
                      <td className="px-6 py-5 text-right font-medium tracking-wide print:px-0">
                        {formatMoney((item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>

        {/* --- ORDER TOTALS FOOTER --- */}
        <div className="p-6 bg-[#faf9f8] border-t border-[#e5e5e5] flex justify-end print:bg-white print:px-0 print:border-none print:mt-4">
          <div className="w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-3 text-sm print:text-black">
            <div className="flex justify-between text-[#666] font-light print:text-black">
              <span>Subtotal</span>
              <span className="tracking-wide">{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#666] font-light border-b border-[#e5e5e5] pb-3 print:text-black print:border-black">
              <span>Delivery Fee</span>
              <span className="tracking-wide">{formatMoney(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between items-center text-[#1a1a1a] pt-1">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Grand Total</span>
              <span className="text-xl font-medium tracking-wide">{formatMoney(order.total_amount)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}