import BestSellers from "@/components/Home/BestSellers";
import BrandStory from "@/components/Home/BrandStory";
import CategoriesSection from "@/components/Home/Categories";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import HeroSection from "@/components/Home/Hero";
import TrendingSection from "@/components/Home/Trending";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

import { getHomePageData } from "@/services/homeServices";
import { getCategoriesLite } from "@/services/homeServices";

// ✅ Enable caching
export const revalidate = 60;

// 🌟 THE SEO ENGINE: Next.js automatically injects this into the <head>
export const metadata = {
  title: 'Asaya Collection | Exclusive Handmade Purses & Luxury Bags',
  description: 'Discover the art of luxury with Asaya Collection. Explore our exclusive range of trending handmade purses, curated best sellers, and beautifully crafted artisanal bags.',
  keywords: ['luxury purses', 'handmade bags', 'Asaya Collection', 'artisanal handbags', 'premium purses', 'handcrafted bags', 'exclusive accessories'],
  openGraph: {
    title: 'Asaya Collection | Luxury Purses & Handmade Bags',
    description: 'Discover the art of luxury with Asaya Collection. Shop our curated masterpieces of handmade purses and bags.',
    url: 'https://www.asayacollection.com', // Update with your actual live domain
    siteName: 'Asaya Collection',
    images: [
      {
        url: '/Logo.png', // You can replace this with a beautiful wide banner image later!
        width: 1200,
        height: 630,
        alt: 'Asaya Collection Luxury Purses',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asaya Collection | Luxury Purses & Handmade Bags',
    description: 'Discover the art of luxury with Asaya Collection. Shop our curated masterpieces of handmade purses and bags.',
    images: ['/Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function Home() {
  const [homeData, categories] = await Promise.all([
    getHomePageData(),
    getCategoriesLite(),
  ]);

  const { trendingProducts, featuredProducts, bestSellers } = homeData;

  return (
    <main>
      <HeroSection />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <CategoriesSection categories={categories} />
      <TrendingSection trendingProducts={trendingProducts} />
      <BestSellers bestSellers={bestSellers} />
      <WhyChooseUs />
      <BrandStory />
    </main>
  );
}