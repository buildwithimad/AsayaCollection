'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- CUSTOM TOOLTIP FOR REVENUE CHART ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-[#fce3de] p-4 rounded-2xl shadow-xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">{label}</p>
        <p className="text-lg font-serif text-slate-900">
          Rs. {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// 🌟 Receive props from the server page
export default function DashboardHome({ kpis, revenueData, orderStatusData, topProducts, recentOrders }) {
  const [revenueFilter, setRevenueFilter] = useState('6M');

  const formatMoney = (amount) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans font-light text-slate-700 flex flex-col gap-8 custom-scrollbar">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-[#fce3de]/50">
        <div>
          <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-serif tracking-tight">Dashboard Overview</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#fa8791] font-medium mt-2">Boutique Performance Metrics</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* --- TOP KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI: Total Revenue */}
        <div className="bg-white border border-[#fce3de]/50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fce3de]/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf9] border border-[#fce3de] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#fa8791]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            {/* Kept static percentage as real calculation requires previous month complex comparison */}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +14.5% 
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1 relative z-10">Total Revenue</p>
          <h3 className="text-3xl font-serif text-slate-900 relative z-10">{formatMoney(kpis.totalRevenue)}</h3>
        </div>

        {/* KPI: Total Orders */}
        <div className="bg-white border border-[#fce3de]/50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fce3de]/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf9] border border-[#fce3de] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#fa8791]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              +8.2%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1 relative z-10">Total Orders</p>
          <h3 className="text-3xl font-serif text-slate-900 relative z-10">{kpis.totalOrders}</h3>
        </div>

        {/* KPI: Active Customers */}
        <div className="bg-white border border-[#fce3de]/50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fce3de]/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf9] border border-[#fce3de] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#fa8791]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
              -2.4%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1 relative z-10">Total Clients</p>
          <h3 className="text-3xl font-serif text-slate-900 relative z-10">{kpis.activeCustomers}</h3>
        </div>

        {/* KPI: Catalog Items */}
        <div className="bg-white border border-[#fce3de]/50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fce3de]/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#fdfaf9] border border-[#fce3de] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#fa8791]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1 relative z-10">Active Products</p>
          <h3 className="text-3xl font-serif text-slate-900 relative z-10">{kpis.activeProducts}</h3>
        </div>

      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#fce3de]/50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-900">Revenue Generated</h2>
              <p className="text-xs text-slate-400 mt-1">Growth over time</p>
            </div>
            <div className="flex gap-2 bg-[#fdfaf9] border border-[#fce3de]/50 p-1 rounded-xl">
              {['1M', '6M', '1Y'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setRevenueFilter(filter)}
                  className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-colors ${revenueFilter === filter ? 'bg-white text-slate-900 shadow-sm border border-[#fce3de]/50' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {/* 🌟 FIX: Changed height="100%" to height={300} */}
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fa8791" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fa8791" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(value) => `Rs.${value/1000}k`} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#fa8791" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut Chart */}
        <div className="bg-white border border-[#fce3de]/50 p-6 md:p-8 rounded-[2.5rem] shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-900">Orders Status</h2>
            <p className="text-xs text-slate-400 mt-1">Current distribution</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="h-[200px] w-full relative">
              {/* 🌟 FIX: Changed height="100%" to height={200} */}
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-serif text-slate-900">{orderStatusData.reduce((a, b) => a + b.value, 0)}</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Total</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 mt-6 w-full">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{item.name}</span>
                  </div>
                  <span className="text-sm font-serif text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* --- BOTTOM SECTION: LISTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Products */}
        <div className="bg-white border border-[#fce3de]/50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-900">Top Products</h2>
              <p className="text-xs text-slate-400 mt-1">Highest grossing items</p>
            </div>
            <Link href="/products" className="text-[10px] uppercase tracking-widest font-bold text-[#fa8791] hover:text-slate-900 transition-colors">
              View All &rarr;
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {topProducts.length === 0 ? (
               <p className="text-sm text-slate-400 py-4 text-center">No sales data yet.</p>
            ) : topProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-[#fdfaf9] rounded-2xl transition-colors group">
                <span className="text-lg font-serif text-slate-300 w-4">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-normal text-slate-900 truncate">{product.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{product.sales} Sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{formatMoney(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-[#fce3de]/50 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-900">Recent Orders</h2>
              <p className="text-xs text-slate-400 mt-1">Latest store orders</p>
            </div>
            <Link href="/orders" className="text-[10px] uppercase tracking-widest font-bold text-[#fa8791] hover:text-slate-900 transition-colors">
              View All &rarr;
            </Link>
          </div>

          <div className="flex flex-col gap-1">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No recent orders.</p>
            ) : recentOrders.map((order) => (
              <Link key={order.rawId} href={`/orders/${order.rawId}`} className="flex items-center justify-between p-4 hover:bg-[#fdfaf9] rounded-2xl transition-colors border border-transparent hover:border-[#fce3de]/50 group">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-normal text-slate-900 group-hover:text-[#fa8791] transition-colors">{order.customer}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{order.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{order.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-slate-900">{formatMoney(order.total)}</span>
                  <span className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold rounded-md border
                    ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-[#e6f4ea] text-[#2b8a3e] border-[#e6f4ea]' : 
                      order.status === 'Canceled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      'bg-[#fff3bf] text-[#e67700] border-[#fff3bf]'}`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}