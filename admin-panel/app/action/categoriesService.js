'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getCategoriesPaginated(page = 1, search = '', limit = 10) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('categories').select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return { categories: [], totalCount: 0 };
  return { categories: data || [], totalCount: count || 0 };
}

export async function addCategoryAction(categoryData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== 'superAdmin') return { success: false, message: "Unauthorized" };

  // Expecting categoryData: { name, subtitle, image }
  const { error } = await supabase.from('categories').insert([categoryData]);
  if (error) return { success: false, message: error.message };
  return { success: true };
}


export async function updateCategoryAction(id, categoryData) {
  const supabase = await createClient();
  
  // 1. Security Check
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== 'superAdmin') {
    return { success: false, message: "Unauthorized" };
  }

  // 2. Fetch the current category to check the existing image
  const { data: oldCategory, error: fetchError } = await supabase
    .from('categories')
    .select('image')
    .eq('id', id)
    .single();

  if (fetchError) return { success: false, message: "Category not found" };

  // 3. Logic: If a new image is provided and it's different from the old one
  if (categoryData.image && oldCategory.image && categoryData.image !== oldCategory.image) {
    try {
      // Extract filename from the old URL
      // Example: https://.../category-images/cat_old.png -> cat_old.png
      const urlParts = oldCategory.image.split('/');
      const oldFileName = urlParts[urlParts.length - 1];

      // Delete the old file from storage
      const { error: storageError } = await supabase.storage
        .from('category-images')
        .remove([oldFileName]);

      if (storageError) {
        console.warn("Could not delete old image from storage:", storageError.message);
      }
    } catch (err) {
      console.error("Failed to parse old image URL:", err);
    }
  }

  // 4. Update the record in the database
  const { error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id);

  if (error) return { success: false, message: error.message };
  return { success: true };
}




export async function deleteCategoryAction(id) {
  const supabase = await createClient();
  
  // 1. Security Check
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== 'superAdmin') {
    return { success: false, message: "Unauthorized" };
  }

  // 2. Fetch the category first to get the image URL
  const { data: category, error: fetchError } = await supabase
    .from('categories')
    .select('image')
    .eq('id', id)
    .single();

  if (fetchError) return { success: false, message: "Category not found" };

  // 3. If there is an image, delete it from Storage
  if (category?.image) {
    try {
      // Extract the filename from the URL
      // Example: https://.../category-images/cat_123.png -> cat_123.png
      const urlParts = category.image.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error: storageError } = await supabase.storage
        .from('category-images')
        .remove([fileName]);

      if (storageError) {
        console.error("Storage deletion warning:", storageError.message);
        // We continue anyway so the DB record gets deleted even if the file is missing
      }
    } catch (err) {
      console.error("Failed to parse image URL for deletion:", err);
    }
  }

  // 4. Delete the row from the database
  const { error } = await supabase.from('categories').delete().eq('id', id);
  
  if (error) return { success: false, message: error.message };
  return { success: true };
}