'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getDashboardData() {
  const supabase = await createClient();

  // 1. Fetch all orders and active products count
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  const { count: activeProductsCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true);

  const validOrders = orders || [];

  // --- KPI CALCULATIONS ---
  let totalRevenue = 0;
  const uniqueCustomersSet = new Set(); 
  
  validOrders.forEach(order => {
    if (order.status === 'Completed' || order.status === 'Delivered') {
      totalRevenue += order.total_amount || 0;
    }
    
    // 🌟 Make sure we catch EVERY unique person, even if they used a phone number instead of an email
    const uniqueId = (order.email || order.customer_email || order.phone || order.id).toString().toLowerCase();
    uniqueCustomersSet.add(uniqueId);
  });

  const kpis = {
    totalRevenue,
    totalOrders: validOrders.length,
    uniqueCustomers: uniqueCustomersSet.size, // 🌟 FIX: Name changed to match the frontend
    activeProducts: activeProductsCount || 0
  };

  // --- REVENUE CHART DATA (Last 7 Months) ---
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueMap = {};
  
  // Initialize last 7 months with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    revenueMap[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = { name: monthNames[d.getMonth()], revenue: 0, sortKey: d.getTime() };
  }

  validOrders.forEach(order => {
    if (order.status === 'Completed' || order.status === 'Delivered') {
      const d = new Date(order.created_at);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (revenueMap[key]) {
        revenueMap[key].revenue += order.total_amount || 0;
      }
    }
  });

  const revenueData = Object.values(revenueMap).sort((a, b) => a.sortKey - b.sortKey).map(({name, revenue}) => ({name, revenue}));

  // --- ORDER STATUS DATA ---
  let completed = 0, pending = 0, canceled = 0;
  validOrders.forEach(order => {
    if (order.status === 'Completed' || order.status === 'Delivered') completed++;
    else if (order.status === 'Canceled') canceled++;
    else pending++;
  });

  const orderStatusData = [
    { name: 'Completed', value: completed, color: '#10b981' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Canceled', value: canceled, color: '#f43f5e' },
  ];

  // --- TOP PRODUCTS ---
  const productSalesMap = {};
  validOrders.forEach(order => {
    if (order.status !== 'Canceled' && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const id = item.id || item.name;
        if (!productSalesMap[id]) {
          productSalesMap[id] = { 
            id, 
            name: item.name || item.title || 'Unknown Item', 
            sales: 0, 
            revenue: 0 
          };
        }
        const qty = item.quantity || 1;
        productSalesMap[id].sales += qty;
        productSalesMap[id].revenue += (item.price || 0) * qty;
      });
    }
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // --- RECENT ORDERS ---
  const recentOrders = validOrders.slice(0, 4).map(order => ({
    id: order.order_number || order.id.slice(0, 8).toUpperCase(),
    rawId: order.id,
    customer: order.customer_name || 'Guest',
    date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    total: order.total_amount || 0,
    status: order.status || 'Pending'
  }));

  return { kpis, revenueData, orderStatusData, topProducts, recentOrders };
}