'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; 
import { getOrderByNumberAndEmail, getOrdersByUserId, cancelOrder } from '@/services/orderServices'; 

export default function MyOrders() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- AUTH & LOGGED-IN STATE ---
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  // --- GUEST TRACKING STATE ---
  const [searchInput, setSearchInput] = useState('');
  const [searchEmail, setSearchEmail] = useState(''); // NEW: Email tracking state
  const [activeOrder, setActiveOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const orders = await getOrdersByUserId(session.user.id);
        setUserOrders(orders || []);
      }
    } catch (err) {
      console.error("Auth/Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- GUEST TRACKING FUNCTION ---
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!searchInput.trim() || !searchEmail.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const order = await getOrderByNumberAndEmail(searchInput.trim(), searchEmail.trim());
      
      if (order) {
        setActiveOrder(order);
      } else {
        setError("No order found with that combination of Number and Email.");
      }
    } catch (err) {
      console.error("Tracking Error:", err);
      setError("Something went wrong while searching for your order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setActiveOrder(null);
    setSearchInput('');
    setSearchEmail('');
    setError(null);
  };

  // --- HANDLE REAL-TIME UI UPDATE ---
  const handleOrderUpdated = (updatedOrder) => {
    if (user) {
      setUserOrders((prevOrders) => 
        prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    } else {
      setActiveOrder(updatedOrder);
    }
  };

  // --- REUSABLE ORDER CARD ---
  const OrderCard = ({ order, onUpdate }) => {
    const [isCancelling, setIsCancelling] = useState(false);

    const dateObj = new Date(order.created_at);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    const orderTimeMs = dateObj.getTime();
    const currentTimeMs = new Date().getTime();
    const hoursPassed = (currentTimeMs - orderTimeMs) / (1000 * 60 * 60);
    
    const statusStr = order.status?.toLowerCase() || '';
    
    // Check if it can be cancelled
    const isWithin12Hours = hoursPassed <= 12;
    const isCancellableStatus = ['pending', 'order placed'].includes(statusStr);
    const canCancel = isWithin12Hours && isCancellableStatus;

    // Badge Styles
    let statusStyles = "bg-[#faf9f8] text-[#666] border-[#e5e5e5]"; 
    if (statusStr === 'pending' || statusStr === 'order placed') {
      statusStyles = "bg-white text-[#1a1a1a] border-[#1a1a1a]/20";
    } else if (statusStr === 'shipped') {
      statusStyles = "bg-[#1a1a1a] text-white border-[#1a1a1a]";
    } else if (statusStr === 'delivered') {
      statusStyles = "bg-[#e6b93d]/10 text-[#c29623] border-[#e6b93d]/30";
    } else if (statusStr === 'cancelled') {
      statusStyles = "bg-[#b33a3a]/10 text-[#b33a3a] border-[#b33a3a]/30";
    }

    // --- EXECUTE CANCELLATION ---
    const triggerCancel = async () => {
      if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
      
      setIsCancelling(true);
      try {
        // We pass the searchEmail if they are a guest. If they are logged in, we can just pass null 
        // because the database will check their auth.uid() automatically!
        const emailToPass = user ? null : searchEmail;
        
        const updatedData = await cancelOrder(order.id, emailToPass);
        onUpdate(updatedData); // Instantly updates UI to "Cancelled"
      } catch (err) {
        alert(err.message || "Failed to cancel order. Please contact support.");
      } finally {
        setIsCancelling(false);
      }
    };

    return (
      <div className="bg-white border border-[#e5e5e5] hover:border-[#1a1a1a]/30 transition-colors duration-500 flex flex-col mb-12">
        <div className="bg-[#faf9f8] border-b border-[#e5e5e5] p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] text-[#888] uppercase tracking-[0.25em] mb-2 font-bold">
              Date Placed: {formattedDate}
            </p>
            <p className="text-sm text-[#1a1a1a] font-medium tracking-wide">
              {order.order_number || `Order #${order.id.split('-')[0]}`}
            </p>
          </div>
          <span className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold border rounded-sm ${statusStyles}`}>
            {order.status || 'Processing'}
          </span>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-8">
          {order.items && order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 group">
              <div className="relative w-20 h-24 md:w-24 md:h-32 bg-[#faeceb]/40 shrink-0 overflow-hidden">
                <Image 
                  src={item.image || "/Hero.png"} 
                  alt={item.name} 
                  fill 
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${statusStr === 'cancelled' ? 'grayscale opacity-70' : ''}`} 
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className={`text-sm md:text-base font-light tracking-wide mb-1.5 transition-colors duration-300 ${statusStr === 'cancelled' ? 'text-[#888] line-through' : 'text-[#1a1a1a] group-hover:text-[#666]'}`}>
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-[#888] uppercase tracking-widest font-medium">
                    Color: {item.color || 'Standard'} <span className="mx-2 opacity-50">|</span> Qty: {item.quantity}
                  </p>
                </div>
                <span className={`text-sm font-medium ${statusStr === 'cancelled' ? 'text-[#888]' : 'text-[#1a1a1a]'}`}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e5e5e5] p-6 md:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={statusStr === 'cancelled' ? 'opacity-50' : ''}>
            <p className="text-[10px] text-[#888] uppercase tracking-[0.25em] mb-3 font-bold">Shipping To</p>
            <p className="text-sm text-[#4a4a4a] font-light leading-relaxed">
              {order.customer_name}<br />
              {order.address} {order.landmark && `, ${order.landmark}`}<br />
              {order.city}, {order.province} {order.zipcode}<br />
              {order.phone}
            </p>
          </div>
          <div className={statusStr === 'cancelled' ? 'opacity-50' : ''}>
            <p className="text-[10px] text-[#888] uppercase tracking-[0.25em] mb-3 font-bold">Payment Method</p>
            <p className="text-sm text-[#4a4a4a] font-light leading-relaxed">
              Cash on Delivery (COD)
            </p>
          </div>
        </div>

        <div className="bg-[#faf9f8] border-t border-[#e5e5e5] p-6 md:p-8 flex flex-col gap-3">
          <div className={`flex justify-between items-center text-xs font-light ${statusStr === 'cancelled' ? 'text-[#888]' : 'text-[#666]'}`}>
            <span>Subtotal</span>
            <span>Rs. {order.subtotal?.toLocaleString()}</span>
          </div>
          <div className={`flex justify-between items-center text-xs font-light ${statusStr === 'cancelled' ? 'text-[#888]' : 'text-[#666]'}`}>
            <span>Shipping</span>
            <span>Rs. {order.delivery_fee?.toLocaleString()}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mt-4 pt-4 border-t border-[#e5e5e5]/50">
            <div className={`flex flex-col gap-1 ${statusStr === 'cancelled' ? 'opacity-50' : ''}`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                {statusStr === 'cancelled' ? 'Total Cancelled' : 'Total Paid'}
              </span>
              <span className="text-xl md:text-2xl font-light text-[#1a1a1a]">
                <span className="text-[10px] text-[#888] uppercase mr-2 tracking-widest font-medium">PKR</span>
                Rs. {order.total_amount?.toLocaleString()}
              </span>
            </div>

            {statusStr !== 'cancelled' && (
              <div>
                {canCancel ? (
                  <button 
                    onClick={triggerCancel}
                    disabled={isCancelling}
                    className="border border-[#b33a3a]/40 text-[#b33a3a] px-6 py-2.5 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-[#b33a3a]/5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                ) : (
                  <span className="text-[9px] uppercase tracking-widest text-[#888] font-medium" title="Orders can only be cancelled within 12 hours of placement.">
                    Cancellation window closed
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#fdfbfb]">
        <div className="w-8 h-8 border-t-2 border-r-2 border-[#1a1a1a] rounded-full animate-spin mb-6"></div>
        <div className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#666] animate-pulse">Locating Orders</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#fdfbfb] pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[900px] mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-[#e5e5e5] pb-8 gap-6">
            <div>
              <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-4 block">Your Account</span>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a]">Order History</h1>
            </div>
            <p className="text-[10px] text-[#666] uppercase tracking-widest font-medium">
              Signed in as <br className="hidden md:block" />
              <span className="text-[#1a1a1a]">{user.email}</span>
            </p>
          </div>

          {userOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#1a1a1a] mb-6">No orders placed yet.</h2>
              <p className="text-[#666] text-sm font-light mb-12 max-w-md leading-relaxed">Discover our latest collections and find your new signature piece.</p>
              <Link href="/collections" className="bg-[#1a1a1a] text-white px-12 py-5 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#e6b93d] transition-colors duration-500">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {userOrders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdate={handleOrderUpdated} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fdfbfb] px-6 text-center pt-20">
        <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-6 block">Client Services</span>
        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#1a1a1a] mb-6">Track Your Order</h2>
        <p className="text-[#666] text-sm font-light mb-12 max-w-md leading-relaxed">
          Enter your Order Number and Email to check the status or cancel your purchase. <br/><br/>
          <Link href="/login" className="border-b border-[#1a1a1a] pb-0.5 hover:text-[#e6b93d] hover:border-[#e6b93d] transition-colors">Log in</Link> to view your complete order history.
        </p>

        <form onSubmit={handleTrackOrder} className="w-full max-w-md flex flex-col gap-4">
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Order Number (e.g. ASAYA-123456)" 
            required
            className="w-full bg-white border border-[#e5e5e5] px-6 py-4 text-sm font-medium tracking-widest text-center text-[#1a1a1a] placeholder:text-[#ccc] placeholder:font-light focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all rounded-sm uppercase"
          />
          <input 
            type="email" 
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Email Address" 
            required
            className="w-full bg-white border border-[#e5e5e5] px-6 py-4 text-sm font-medium tracking-widest text-center text-[#1a1a1a] placeholder:text-[#ccc] placeholder:font-light focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all rounded-sm"
          />
          
          {error && <p className="text-xs text-[#b33a3a] mt-2 font-medium tracking-wide">{error}</p>}
          
          <button type="submit" className="w-full bg-[#1a1a1a] text-white px-12 py-5 mt-4 cursor-pointer text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#e6b93d] transition-colors duration-500">
            Track Order
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbfb] pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-[#e5e5e5] pb-8 gap-6">
          <div>
            <span className="uppercase tracking-[0.3em] text-[#888] text-[10px] font-bold mb-4 block">Guest Tracking</span>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1a1a1a]">Order Details</h1>
          </div>
          <button onClick={handleReset} className="text-[10px] uppercase cursor-pointer tracking-widest font-bold text-[#1a1a1a] border-b border-[#1a1a1a] pb-1 hover:text-[#e6b93d] hover:border-[#e6b93d] transition-colors">
            Track Another Order
          </button>
        </div>

        <OrderCard order={activeOrder} onUpdate={handleOrderUpdated} />
      </div>
    </div>
  );
}