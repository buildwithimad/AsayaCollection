import CustomersUI from '@/components/Customers/CustomerUI'; // Adjust path if needed
import { getCustomers } from '@/app/action/customerService';

export const metadata = {
  title: 'Client Directory | Asaya Admin',
};

export default async function CustomersPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search || '';

  // Fetch unique buyers from the server action
  const { customers, totalCount, limit } = await getCustomers({ page, search });

  return (
    <CustomersUI 
      initialCustomers={customers}
      totalCount={totalCount}
      currentPage={page}
      currentSearch={search}
      limit={limit}
    />
  );
}