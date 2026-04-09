'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getFilteredProductsAction({ category, sort, bestSeller, trending }) {
  const supabase = await createClient();

  // 1. Base Query: Fetch products and their related category name
  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(name)
    `);

  // 2. Apply Category Filter
  if (category && category !== "All") {
    query = query.eq('categories.name', category);
  }

  // 3. Apply Feature Filters
  if (bestSeller) {
    query = query.eq('is_best_seller', true);
  }
  if (trending) {
    query = query.eq('is_trending', true);
  }

  // 4. Apply Sorting
  if (sort === "Price: Low to High") {
    query = query.order('price', { ascending: true });
  } else if (sort === "Price: High to Low") {
    query = query.order('price', { ascending: false });
  } else {
    // Default: Newest Arrivals
    query = query.order('created_at', { ascending: false });
  }

  // 5. Execute Query
  const { data, error } = await query;

  if (error) {
    console.error("Database Error fetching products:", error.message);
    return [];
  }

  return data;
}