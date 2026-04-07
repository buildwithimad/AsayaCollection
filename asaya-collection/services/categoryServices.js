// /services/productService.js
import { supabase } from "@/lib/supabase";

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error) throw new Error(error.message);

  return data;
}