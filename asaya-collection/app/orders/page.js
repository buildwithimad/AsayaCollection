// /app/orders/page.js
import MyOrders from "@/components/Orders/MyOrders";
import { getUserOrders } from "@/services/orderServices";

export default async function OrdersPage() {
  // TODO: Replace this with your actual logged-in user's email 
  const userEmail = "kimad1728@gmail.com"; 

  // Fetch the orders server-side
  const orders = await getUserOrders(userEmail);

  return (
    <main>
      <MyOrders orders={orders} />
    </main>
  );
}