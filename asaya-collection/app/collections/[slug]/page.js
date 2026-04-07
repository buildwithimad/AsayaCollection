// /app/collections/[slug]/page.js

import ProductDetails from "@/components/Products/ProductDetails";
import { getProductDetails } from "@/services/productServices";
import { notFound } from "next/navigation";

// Notice how we use an async function here
const ProductDetailsPage = async ({ params }) => {
  // 1. AWAIT THE PARAMS PROMISE FIRST! (Next.js 15 Requirement)
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 2. Now fetch using the resolved slug
  const product = await getProductDetails(slug);

  console.log("Product Details:", product);

  if (!product) return notFound();

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetailsPage;