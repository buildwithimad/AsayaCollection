'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getOrders({ page = 1, search = '', startDate = '', endDate = '' }) {
  const supabase = await createClient();
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 1. Start the query on your 'orders' table
  // We use { count: 'exact' } to get the total number of orders for pagination math
  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' });

  // 2. Apply Universal Search Filter (Order Number, Name, or Email)
  if (search) {
    // ilike is case-insensitive search. % means wildcard (e.g., matches anything containing the search term)
    query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // 3. Apply Date Filters
  if (startDate) {
    query = query.gte('created_at', `${startDate}T00:00:00.000Z`); // Greater than or equal to start of day
  }
  if (endDate) {
    query = query.lte('created_at', `${endDate}T23:59:59.999Z`); // Less than or equal to end of day
  }

  // 4. Apply Pagination and Sorting
  query = query
    .order('created_at', { ascending: false }) // Newest first
    .range(from, to);

  // 5. Execute Query
  const { data: orders, error, count } = await query;

  if (error) {
    console.error('Error fetching orders:', error.message);
    return { orders: [], totalCount: 0 };
  }

  return { orders, totalCount: count };
}


export async function getOrderDetails(id) {
  const supabase = await createClient();

  // Simple query: Fetch the order. The JSONB 'items' column comes with it!
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order details:', error.message);
    return null;
  }

  return order;
}


export async function deleteOrderAction(id) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').delete().eq('id', id);

  if (error) {
    console.error("Delete Error:", error.message);
    return { success: false, message: error.message };
  }
  return { success: true };
}


export async function updateOrderStatusAction(id, status) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status: status })
    .eq('id', id);

  if (error) {
    console.error("Status Update Error:", error.message);
    return { success: false, message: error.message };
  }
  return { success: true };
}