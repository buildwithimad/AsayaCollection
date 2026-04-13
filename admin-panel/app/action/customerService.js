'use server';

import { createClient } from '@/lib/supabaseServer'; 

export async function getCustomers({ page = 1, search = '' }) {
  
  const supabase = await createClient();

  // 1. Fetch relevant fields (🌟 Added 'id' for the guest fallback logic)
  const { data: allOrders, error } = await supabase
    .from('orders')
    .select('id, customer_name, email, phone, total_amount, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error.message);
    return { customers: [], totalCount: 0, limit: 10 };
  }

  // 2. Group orders to create unique Client Profiles
  const customerMap = new Map();

  allOrders.forEach((order) => {
    // 🌟 Safest Unique ID: Tries Email -> then Phone -> then Order ID
    const uniqueId = (order.email || order.phone || order.id).toString().toLowerCase();
    
    if (!customerMap.has(uniqueId)) {
      customerMap.set(uniqueId, {
        id: uniqueId,
        name: order.customer_name || 'Guest User',
        email: order.email || 'No Email provided',
        phone: order.phone || null,
        total_orders: 0,
        total_spent: 0,
        last_order_date: order.created_at,
      });
    }

    // Increment their totals
    const customer = customerMap.get(uniqueId);
    customer.total_orders += 1;
    customer.total_spent += (order.total_amount || 0);
  });

  // Convert the Map back into a standard array
  let uniqueCustomers = Array.from(customerMap.values());

  // ==========================================
  // 🌟 VIP FILTER: MORE THAN 3 ORDERS ONLY
  // ==========================================
  uniqueCustomers = uniqueCustomers.filter(customer => customer.total_orders > 3);

  // 3. Apply Universal Search (only searches the VIPs now)
  if (search) {
    const s = search.toLowerCase();
    uniqueCustomers = uniqueCustomers.filter((c) => 
      c.name.toLowerCase().includes(s) || 
      c.email.includes(s) || 
      (c.phone && c.phone.includes(s))
    );
  }

  // 4. Apply Pagination
  const limit = 10;
  const totalCount = uniqueCustomers.length; // Count of VIPs matching search
  const from = (page - 1) * limit;
  const paginatedCustomers = uniqueCustomers.slice(from, from + limit);

  return { customers: paginatedCustomers, totalCount, limit };
}