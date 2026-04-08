import DashboardHome from '@/components/Dashboard/Dashboard';
import { getDashboardData } from '@/app/action/dashboardServices';

export const metadata = {
  title: 'Dashboard | Asaya Control Panel',
};

export default async function DashboardPage() {
  // Fetch real data on the server
  const data = await getDashboardData();

  return (
    <>
      <DashboardHome 
        kpis={data.kpis}
        revenueData={data.revenueData}
        orderStatusData={data.orderStatusData}
        topProducts={data.topProducts}
        recentOrders={data.recentOrders}
      />
    </>
  );
}