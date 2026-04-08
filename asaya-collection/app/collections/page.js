import Products from "@/components/Products/Products";
import { getAllProducts } from "@/services/productServices";
import { getAllCategories } from "@/services/categoryServices";

export default async function ProductsPage({ searchParams }) {
  // 1. Await searchParams (Next.js 15 Requirement)
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;


  // 3. Fetch product and category data
  const { products, totalPages } = await getAllProducts(page);
  const categories = await getAllCategories();


  return (
    <main>
      {/* 4. Pass the user object to the client component */}
      <Products 
        products={products} 
        totalPages={totalPages} 
        categories={categories} 
        
      />
    </main>
  );
}