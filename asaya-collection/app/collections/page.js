// /app/products/page.js
import Products from "@/components/Products/Products";
import { getAllProducts } from "@/services/productServices";
import { getAllCategories } from "@/services/categoryServices";

export default async function ProductsPage({ searchParams }) {
  // 1. Await the searchParams Promise (Next.js 15 Requirement)
  const resolvedSearchParams = await searchParams;
  
  // 2. Now safely extract the page number
  const page = Number(resolvedSearchParams.page) || 1;

  // 3. Fetch data using the resolved page number
  const { products, totalPages } = await getAllProducts(page);
  const categories = await getAllCategories();

  console.log("Products:", products);
  console.log("Categories:", categories);

  return (
    <main>
      <Products products={products} totalPages={totalPages} categories={categories} />
    </main>
  );
}