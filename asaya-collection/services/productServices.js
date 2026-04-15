// /services/productService.js
import { supabase } from "@/lib/supabase";

// Get products with pagination (16 per page)
export async function getAllProducts(page = 1, limit = 16) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      reviews(rating) 
    `, { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    products: data,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}

export async function getProductDetails(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      reviews (*)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}



export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(`*, categories(name)`)
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getProductsByCategory(categoryName) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories!inner(name)
    `)
    .eq("categories.name", categoryName)
    .eq("is_published", true);

  if (error) throw new Error(error.message);

  return data;
}

// ✅ Submit a product review to Supabase
export async function submitReview({ product_id, user_name, user_email, comment, rating }) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        product_id,
        user_name,
        user_email, // <-- Added email to match your DB schema
        comment,
        rating
      }
    ])
    .select() 
    .single();

  if (error) throw new Error(error.message);

  return data;
}