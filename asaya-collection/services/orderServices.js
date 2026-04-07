// /services/orderServices.js
import { supabase } from "@/lib/supabase";

export async function submitOrder(orderPayload) {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderPayload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}


// Fetch orders by email
export async function getUserOrders(email) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}


// ✅ Fetch a single order by its Order Number
export async function getOrderByNumber(orderNumber) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .ilike("order_number", orderNumber) // ilike makes it case-insensitive
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}

export async function getOrdersByUserId(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Handle any potential database errors
  if (error) {
    console.error("Error fetching user orders:", error.message);
    throw new Error(error.message);
  }

  // Return the fetched data
  return data;
}




// ✅ Fetch order securely using BOTH Order Number and Email (For Guests)
export async function getOrderByNumberAndEmail(orderNumber, email) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .ilike("order_number", orderNumber) // case-insensitive
    .ilike("email", email)              // case-insensitive
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// ✅ Call the secure database function to cancel the order
export async function cancelOrder(orderId, email = null) {
  const { data, error } = await supabase
    .rpc('secure_cancel_order', { 
      target_order_id: orderId, 
      tracking_email: email 
    });

  if (error) {
    console.error("Error cancelling order:", error.message);
    throw new Error(error.message);
  }

  return data;
}

// (Keep your submitOrder and getOrdersByUserId functions as they are!)