import ProductDetails from "@/components/Products/ProductDetails";
import { getProductDetails } from "@/services/productServices";
import { notFound } from "next/navigation";

// ✅ Enable caching for lightning-fast loads
export const revalidate = 60;

// 🌟 DYNAMIC SEO ENGINE: Generates specific metadata for EACH product!
export async function generateMetadata({ params }) {
  // Await the params to get the slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch the specific product
  const product = await getProductDetails(slug);

  // Fallback if the product doesn't exist
  if (!product) {
    return {
      title: 'Product Not Found | Asaya Collection',
      description: 'The requested masterpiece could not be found.',
    };
  }

  // Use the first image of the product for the link preview, or default to logo
  const ogImage = product.images && product.images.length > 0 ? product.images[0] : '/Logo.png';
  
  // Create a clean description snippet (removes long text if necessary)
  const seoDescription = product.description 
    ? `${product.description.substring(0, 150)}...` 
    : `Discover ${product.name}, a handmade luxury masterpiece by Asaya Collection.`;

  return {
    title: `${product.name} | Asaya Collection`,
    description: seoDescription,
    keywords: [product.name, 'handmade purse', 'luxury bag', 'Asaya Collection', 'artisanal handbag'],
    openGraph: {
      title: `${product.name} | Asaya Collection`,
      description: seoDescription,
      url: `https://www.asayacollection.com/collections/${slug}`, // Update domain when live
      siteName: 'Asaya Collection',
      images: [
        {
          url: ogImage,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Asaya Collection`,
      description: seoDescription,
      images: [ogImage],
    },
  };
}


// Notice how we use an async function here
const ProductDetailsPage = async ({ params }) => {
  // 1. AWAIT THE PARAMS PROMISE FIRST! (Next.js 15 Requirement)
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 2. Now fetch using the resolved slug
  const product = await getProductDetails(slug);

  if (!product) return notFound();

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetailsPage;