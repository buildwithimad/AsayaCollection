import { getOrders } from '@/app/action/ordersService';
import OrdersUI from '@/components/Orders/OrdersUi';

export const metadata = {
  title: 'Orders Directory | Asaya Control Panel',
};

// Next.js automatically passes searchParams to page components!
export default async function OrdersPage({ searchParams }) {
  // Await the searchParams object (Required in newer Next.js versions)
  const params = await searchParams;
  
  // Extract parameters from the URL (or set defaults)
  const currentPage = Number(params?.page) || 1;
  const searchString = params?.search || '';
  const startDate = params?.start || '';
  const endDate = params?.end || '';

  // Securely fetch data on the server
  const { orders, totalCount } = await getOrders({
    page: currentPage,
    search: searchString,
    startDate: startDate,
    endDate: endDate
  });

  console.log('Fetched Orders:', orders);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-end justify-between border-b border-[#e5e5e5] pb-4">
        <div>
          <h1 className="text-2xl font-light text-[#1a1a1a] font-serif tracking-tight">Order Directory</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#888] font-bold mt-2">
            Showing {orders.length} of {totalCount} total records
          </p>
        </div>
      </div>

      {/* Pass the data and current filter state to the Client UI */}
      <OrdersUI 
        initialOrders={orders} 
        totalCount={totalCount} 
        currentPage={currentPage} 
        currentSearch={searchString}
        currentStart={startDate}
        currentEnd={endDate}
      />
    </div>
  );
}