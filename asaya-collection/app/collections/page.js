import Products from "@/components/Products/Products";
import { getAllProducts } from "@/services/productServices";
import { getAllCategories } from "@/services/categoryServices";

// ✅ Enable caching (revalidates every 60 seconds)
export const revalidate = 60;

// 🌟 THE SEO ENGINE: Tailored specifically for your Shop/Products page
export const metadata = {
  title: 'Shop Luxury Purses & Handmade Bags | Asaya Collection',
  description: 'Explore the complete Asaya Collection. Browse our exclusive catalog of handmade purses, artisanal bags, and premium luxury accessories to find your perfect masterpiece.',
  keywords: ['shop luxury purses', 'buy handmade bags', 'Asaya Collection shop', 'premium handbags', 'exclusive purses online', 'artisanal bags catalog'],
  openGraph: {
    title: 'Shop All Masterpieces | Asaya Collection',
    description: 'Browse our exclusive catalog of handmade luxury purses and artisanal bags.',
    url: 'https://www.asayacollection.com/products', // Update with your actual live domain
    siteName: 'Asaya Collection',
    images: [
      {
        url: '/Logo.png', 
        width: 1200,
        height: 630,
        alt: 'Shop Asaya Collection Luxury Purses',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Luxury Purses & Handmade Bags | Asaya Collection',
    description: 'Browse our exclusive catalog of handmade luxury purses and artisanal bags.',
    images: ['/Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function ProductsPage({ searchParams }) {
  // 1. Await searchParams (Next.js 15 Requirement)
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;

  // 3. Fetch product and category data
  const { products, totalPages } = await getAllProducts(page);
  const categories = await getAllCategories();

  console.log("Fetched products:", products); // Debug log to verify fetched products

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