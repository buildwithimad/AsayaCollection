import BestSellers from "@/components/Home/BestSellers";
import BrandStory from "@/components/Home/BrandStory";
import CategoriesSection from "@/components/Home/Categories";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import HeroSection from "@/components/Home/Hero";
import TrendingSection from "@/components/Home/Trending";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

import { getTrendingProducts, getFeaturedProducts, getBestSellers } from "@/services/productServices";

export default async function Home() {


  const [trendingProducts, featuredProducts, bestSellers] = await Promise.all([
    getTrendingProducts(),
    getFeaturedProducts(),
    getBestSellers()
  ]);

  return (
    <main>
      <HeroSection />
      <TrendingSection trendingProducts={trendingProducts} />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <BestSellers bestSellers={bestSellers} />
      <WhyChooseUs />
      <CategoriesSection />
      <BrandStory />
    </main>
  );
}