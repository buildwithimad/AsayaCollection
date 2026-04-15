'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getProducts({ page = 1, search = '' }) {
  const supabase = await createClient();
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  const { data: products, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching products:', error.message);
    return { products: [], totalCount: 0 };
  }
  return { products, totalCount: count };
}




// 🌟 New function to fetch categories for the dropdown
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) return [];
  return data;
}

export async function createProductAction(formData) {
  const supabase = await createClient();
  
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const compare_price = formData.get('compare_price') ? parseFloat(formData.get('compare_price')) : null;
  const stock = parseInt(formData.get('stock'));
  const description = formData.get('description');
  const category_id = formData.get('category_id');
  const is_published = formData.get('is_published') === 'true';
  const is_featured = formData.get('is_featured') === 'true';
  const is_trending = formData.get('is_trending') === 'true';
  const is_best_seller = formData.get('is_best_seller') === 'true';

  // 🌟 Calculate Discount Automatically
  let discount = 0;
  if (compare_price && compare_price > price) {
    discount = Math.round(((compare_price - price) / compare_price) * 100);
  }

  // 🌟 Process Details (Convert multiline text to array)
  const detailsRaw = formData.get('details') || "";
  const detailsArray = detailsRaw.split('\n').filter(line => line.trim() !== "");

  // 🌟 Process Tags (Convert comma-separated to array)
  const tagsRaw = formData.get('tags') || "";
  const tagsArray = tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

  // Slug generation
  const baseSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Image Upload Logic
  const imageFiles = [
    formData.get('image1'), formData.get('image2'), 
    formData.get('image3'), formData.get('image4')
  ].filter(file => file && file.size > 0);

  const imageUrls = [];
  for (const file of imageFiles) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from('product-images').upload(`public/${fileName}`, file);
    if (error) {
      console.error(`🚨 Upload error:`, error.message);
      continue;
    }
    const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(`public/${fileName}`);
    imageUrls.push(publicUrlData.publicUrl);
  }

  // 🌟 Insert matching YOUR exact schema
  const { error: dbError } = await supabase.from('products').insert([{
    name,
    slug: uniqueSlug,
    description,
    price,
    compare_price,
    discount, // Saved automatically
    stock,
    category_id: category_id || null,
    images: imageUrls,
    details: detailsArray,
    tags: tagsArray,
    is_published: is_published,
    is_featured: is_featured,
    is_trending: is_trending,
    is_best_seller: is_best_seller,
  }]);

  if (dbError) return { success: false, message: dbError.message };
  return { success: true };
}

export async function getProductDetails(id) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product details:', error.message);
    return null;
  }

  return product;
}


export async function updateProductAction(formData) {
  const supabase = await createClient();
  
  const id = formData.get('id');
  const name = formData.get('name');
  const price = parseFloat(formData.get('price'));
  const compare_price = formData.get('compare_price') ? parseFloat(formData.get('compare_price')) : null;
  const stock = parseInt(formData.get('stock'));
  const description = formData.get('description');
  const category_id = formData.get('category_id');
    const is_published = formData.get('is_published') === 'true';
    const is_featured = formData.get('is_featured') === 'true';
    const is_trending = formData.get('is_trending') === 'true';
    const is_best_seller = formData.get('is_best_seller') === 'true';

  // Calculate Discount
  let discount = 0;
  if (compare_price && compare_price > price) {
    discount = Math.round(((compare_price - price) / compare_price) * 100);
  }

  // Process Arrays
  const detailsRaw = formData.get('details') || "";
  const detailsArray = detailsRaw.split('\n').filter(line => line.trim() !== "");
  const tagsRaw = formData.get('tags') || "";
  const tagsArray = tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

  // Handle Images (Keep old if no new file uploaded)
  const imageUrls = [];
  for (let i = 1; i <= 4; i++) {
    const file = formData.get(`image${i}`);
    const existingImage = formData.get(`existing_image${i}`);
    
    if (file && file.size > 0) {
      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('product-images').upload(`public/${fileName}`, file);
      
      if (!error) {
        const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(`public/${fileName}`);
        imageUrls.push(publicUrlData.publicUrl);
      }
    } else if (existingImage) {
      // Keep existing image
      imageUrls.push(existingImage);
    }
  }



  // Update Database
  const { error: dbError } = await supabase.from('products').update({
    name, description, price, compare_price, discount, stock, 
    category_id: category_id || null, 
    images: imageUrls, 
    details: detailsArray, 
    tags: tagsArray,
    is_published: is_published
    ,is_featured: is_featured,
    is_trending: is_trending,
    is_best_seller: is_best_seller,
  }).eq('id', id);

  if (dbError) return { success: false, message: dbError.message };
  return { success: true };
}

export async function deleteProductAction(id) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Delete Error:", error.message);
    return { success: false, message: error.message };
  }
  
  return { success: true };
}