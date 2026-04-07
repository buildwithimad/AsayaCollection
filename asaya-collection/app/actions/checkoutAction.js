"use server";

import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function processSecureCheckout(formData, cart, userId) {
  try {
    // 1. EXTRACT IDs TO VERIFY
    const productIds = cart.map(item => item.id);

    // 2. FETCH REAL PRICES FROM DATABASE
    const { data: realProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price, name')
      .in('id', productIds);

    if (dbError) throw new Error("Could not verify product prices.");
    if (!realProducts || realProducts.length === 0) throw new Error("Products not found.");

    // 3. CALCULATE TRUE TOTALS & BUILD SECURE CART
    let trueSubtotal = 0;
    const validatedItems = [];

    for (const cartItem of cart) {
      const realProduct = realProducts.find(p => p.id === cartItem.id);
      
      if (!realProduct) {
        throw new Error(`Product ID ${cartItem.id} is no longer available.`);
      }

      trueSubtotal += (realProduct.price * cartItem.quantity);

      validatedItems.push({
        id: realProduct.id,
        name: realProduct.name,      
        price: realProduct.price,    
        quantity: cartItem.quantity, 
        color: cartItem.color || 'Standard',
        image: cartItem.image
      });
    }

    const shippingCost = formData.shippingMethod === 'express' ? 500 : 250; 
    const trueTotalAmount = trueSubtotal + shippingCost;

    // 4. GENERATE SECURE ORDER NUMBER 
    const secureString = crypto.randomUUID().replace(/-/g, '').toUpperCase();
    const orderNumber = `ASAYA-${secureString.slice(0, 4)}-${secureString.slice(4, 8)}-${secureString.slice(8, 12)}`;

    // 5. BUILD THE SECURE PAYLOAD
    const orderPayload = {
      order_number: orderNumber,
      user_id: userId,
      customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      phone: formData.phone,
      email: formData.email.trim().toLowerCase(), 
      country: "Pakistan",
      province: formData.province,
      city: formData.city,
      address: formData.address,
      zipcode: formData.zipcode || null,
      landmark: formData.landmark || null,
      items: validatedItems, 
      subtotal: trueSubtotal,
      delivery_fee: shippingCost,
      total_amount: trueTotalAmount,
      status: 'Order Placed',
    };

    // 6. SAVE SECURELY TO SUPABASE
    const { error: insertError } = await supabase
      .from("orders")
      .insert([orderPayload]);

    if (insertError) throw new Error(insertError.message);

    // =================================================================
    // 7. AUTOMATIC TRENDING LOGIC (The "Smart Store" Engine)
    // =================================================================
    try {
      for (const item of validatedItems) {
        // Fetch current sales count for this specific product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('sales_count, is_trending')
          .eq('id', item.id)
          .single();

        if (!productError && productData) {
          // Calculate new total sales
          const newSalesCount = (productData.sales_count || 0) + item.quantity;
          
          // Determine if it should be trending (Threshold: 10 sales)
          const shouldBeTrending = productData.is_trending || newSalesCount >= 10;

          // Update the database invisibly in the background
          await supabase
            .from('products')
            .update({ 
              sales_count: newSalesCount,
              is_trending: shouldBeTrending
            })
            .eq('id', item.id);
        }
      }
    } catch (trendingErr) {
      console.error("Non-fatal error: Failed to update trending status:", trendingErr);
    }
    // =================================================================

    // 8. SEND THE EMAIL RECEIPT VIA RESEND
    try {
      const { error: emailError } = await resend.emails.send({
        from: 'Asaya Collection <orders@asayacollection.store>', // Update when you get a domain!
        to: [orderPayload.email],
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase;">Asaya Collection</h2>
            <hr style="border: 0; border-bottom: 1px solid #e5e5e5; margin: 30px 0;" />
            <h1 style="font-weight: 300; font-size: 24px;">Thank you for your order, ${formData.firstName.trim()}.</h1>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              We've received your order and are preparing it for shipment. You can track the status of your order at any time using the details below.
            </p>
            <div style="background-color: #faf9f8; border: 1px solid #e5e5e5; padding: 24px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #888; font-weight: bold;">Order Number</p>
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 500; letter-spacing: 0.1em;">${orderNumber}</p>
              <p style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #888; font-weight: bold;">Total Paid</p>
              <p style="margin: 0; font-size: 16px;">PKR ${trueTotalAmount.toLocaleString()}</p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold;">Track Your Order</a>
          </div>
        `
      });

      if (emailError) console.error("Resend rejected email:", emailError);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    // 9. RETURN SUCCESS TO THE FRONTEND
    return { success: true, orderNumber: orderNumber };

  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, message: error.message };
  }
}