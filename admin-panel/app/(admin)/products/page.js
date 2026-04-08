import { getProducts } from '@/app/action/productService';
import ProductsUI from '@/components/Products/ProductsUi';

export const metadata = {
  title: 'Products Directory | Asaya Control Panel',
};

export default async function ProductsPage({ searchParams }) {
  // Await searchParams in modern Next.js
  const params = await searchParams;
  
  const currentPage = Number(params?.page) || 1;
  const searchString = params?.search || '';

  // Securely fetch data on the server
  const { products, totalCount } = await getProducts({
    page: currentPage,
    search: searchString,
  });

  console.log('Fetched Products:', products);

  return (
    <div className="w-full">
      <ProductsUI 
        initialProducts={products} 
        totalCount={totalCount} 
        currentPage={currentPage} 
        currentSearch={searchString} 
      />
    </div>
  );
}