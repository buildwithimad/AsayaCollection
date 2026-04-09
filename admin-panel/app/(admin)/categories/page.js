import CategoriesUI from '@/components/Categories/Categories';
import { getCategoriesPaginated } from '@/app/action/categoriesService';
import { createClient } from '@/lib/supabaseServer';

export default async function CategoriesPage({ searchParams }) {
  const supabase = await createClient();
  
  // 🌟 Identify the user and check superAdmin status
  const { data: { user } } = await supabase.auth.getUser();
  const isSuperAdmin = user?.user_metadata?.role === 'superAdmin'; 

  const page = parseInt(searchParams?.page || '1');
  const search = searchParams?.search || '';
  const limit = 10;

  const { categories, totalCount } = await getCategoriesPaginated(page, search, limit);

  return (
    <CategoriesUI 
      initialCategories={categories} 
      totalCount={totalCount} 
      currentPage={page} 
      currentSearch={search} 
      isSuperAdmin={isSuperAdmin} // Passed to UI to hide/show buttons
    />
  );
}