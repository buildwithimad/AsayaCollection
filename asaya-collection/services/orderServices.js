// /services/orderServices.js
import { supabase } from "@/lib/supabase";


export async function submitOrder(orderPayload, cartItems) {
  // 🛑 NOTE: Make sure your supabase client is initialized here!
  // Example: const supabase = await createClient();

  // ---------------------------------------------------------
  // 1️⃣ PHASE ONE: VERIFY ALL STOCK (Read-Only)
  // Do not change any database values yet. Just check if the order is valid.
  // ---------------------------------------------------------
  for (const item of cartItems) {
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (fetchError) throw new Error(`Could not verify stock for ${item.name}`);

    // If even ONE item is out of stock, reject the entire checkout
    if (!product || product.stock < item.quantity) {
      throw new Error(`Unfortunately, ${item.name} does not have enough stock remaining.`);
    }
  }

  // ---------------------------------------------------------
  // 2️⃣ PHASE TWO: SECURE THE ORDER
  // Now that we know stock is good, create the order FIRST.
  // ---------------------------------------------------------
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([orderPayload])
    .select()
    .single();

  if (orderError) throw new Error(`Order failed to process: ${orderError.message}`);

  // ---------------------------------------------------------
  // 3️⃣ PHASE THREE: DEDUCT THE STOCK
  // The order is safely in the database. Now we adjust the warehouse numbers.
  // ---------------------------------------------------------
  for (const item of cartItems) {
    // Fetch fresh stock to be 100% mathematically accurate
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (product) {
      // Math.max ensures your database stock can NEVER drop below 0
      const newStock = Math.max(0, product.stock - item.quantity);

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.id);

      if (updateError) {
        // 🌟 CRITICAL: We console.error here instead of throwing an error!
        // The customer's order was already successful in Phase 2. 
        // If a stock update fails (usually due to Supabase RLS security policies), 
        // we don't want to show the customer a terrifying "Checkout Failed" screen.
        console.error(`Admin Alert: Failed to update stock for ${item.name}:`, updateError.message);
      }
    }
  }

  // 4️⃣ Return the successful order back to the Checkout component
  return orderData;
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




// ✅ Fetch order securely using our Database RPC function (Bypasses RLS safely)
export async function getOrderByNumberAndEmail(orderNumber, email) {
  
  // Notice we use .rpc() instead of .from().select()
  const { data, error } = await supabase
    .rpc("get_guest_order", { 
      track_order_number: orderNumber, 
      track_email: email 
    })
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