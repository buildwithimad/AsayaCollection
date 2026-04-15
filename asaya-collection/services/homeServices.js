import { supabase } from "@/lib/supabase";

export async function getHomePageData() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      images,
      sales_count,
      is_trending,
      is_best_seller,
      created_at,
      categories(name)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(50); // 👈 enough for homepage

  if (error) throw new Error(error.message);

  // ✅ Filter in backend (FAST)
  const trendingProducts = data
    .filter(p => p.is_trending || p.sales_count > 10)
    .sort((a, b) => b.sales_count - a.sales_count)
    .slice(0, 10);

  const bestSellers = data
    .filter(p => p.is_best_seller)
    .slice(0, 12);

  const featuredProducts = data
    .slice(0, 12);

  return {
    trendingProducts,
    bestSellers,
    featuredProducts,
  };
}


export async function getCategoriesLite() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, image")
    .limit(20);

  if (error) throw new Error(error.message);

  return data;
}