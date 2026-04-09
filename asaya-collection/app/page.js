import BestSellers from "@/components/Home/BestSellers";
import BrandStory from "@/components/Home/BrandStory";
import CategoriesSection from "@/components/Home/Categories";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import HeroSection from "@/components/Home/Hero";
import TrendingSection from "@/components/Home/Trending";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

import { getTrendingProducts, getFeaturedProducts, getBestSellers } from "@/services/productServices";
import { getAllCategories } from "@/services/categoryServices";

export default async function Home() {


  const [trendingProducts, featuredProducts, bestSellers, categories] = await Promise.all([
    getTrendingProducts(),
    getFeaturedProducts(),
    getBestSellers(),
    getAllCategories()
  ]);


 console.log("All Categories:", categories); // Debugging log to verify categories are fetched correctly

  return (
    <main>
      <HeroSection />
      <TrendingSection trendingProducts={trendingProducts} />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <BestSellers bestSellers={bestSellers} />
      <WhyChooseUs />
      <CategoriesSection categories={categories} />
      <BrandStory />
    </main>
  );
}