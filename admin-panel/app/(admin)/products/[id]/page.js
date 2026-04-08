import { getProductDetails } from '@/app/action/productService';
import ProductDetailsUI from '@/components/Products/ProductDetailsUI';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Product Details | Asaya Control Panel',
};

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await getProductDetails(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full">
      <ProductDetailsUI product={product} />
    </div>
  );
}