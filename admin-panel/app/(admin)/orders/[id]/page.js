import { getOrderDetails } from '@/app/action/ordersService';
import OrderDetailsUI from '@/components/Orders/OrderDetailsUi';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Order Details | Asaya Control Panel',
};

export default async function OrderDetailsPage({ params }) {
  // Await the params object (Standard in modern Next.js)
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // Securely fetch data on the server
  const order = await getOrderDetails(orderId);

  // If no order exists with that ID, trigger a 404
  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <OrderDetailsUI order={order} />
    </div>
  );
}