'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase'; 
import { addCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/app/action/categoriesService';

export default function CategoriesUI({ initialCategories, totalCount, currentPage, currentSearch, isSuperAdmin }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FORM & IMAGE STATES ---
  const [formData, setFormData] = useState({ name: '', subtitle: '', image: '' });
  const [selectedFile, setSelectedFile] = useState(null); // Actual file to upload
  const [previewUrl, setPreviewUrl] = useState(''); // Local preview URL

  const ITEMS_PER_PAGE = 10;

  const updateFilters = (newPage = 1) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    if (search) params.set('search', search); else params.delete('search');
    router.push(`${pathname}?${params.toString()}`);
  };

  // --- LOCAL FILE HANDLER (Does NOT upload yet) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create a local blob URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', subtitle: '', image: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({ 
      name: category.name || '', 
      subtitle: category.subtitle || '', 
      image: category.image || '' 
    });
    setSelectedFile(null); // No new file selected yet
    setPreviewUrl(''); // No new preview
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
    setFormData({ name: '', subtitle: '', image: '' });
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl); // Clean memory
    setPreviewUrl('');
  };

  // --- SUBMIT HANDLER (Uploads + DB Save) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return alert("Unauthorized");
    
    setIsProcessing(true);
    let finalImageUrl = formData.image;

    try {
      // 1. UPLOAD IMAGE ONLY NOW (If a new file was picked)
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `cat_${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('category-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      // 2. SAVE TO DATABASE
      const submitData = {
        name: formData.name,
        subtitle: formData.subtitle,
        image: finalImageUrl
      };

      const result = modalMode === 'add' 
        ? await addCategoryAction(submitData)
        : await updateCategoryAction(selectedCategory.id, submitData);

      if (result.success) {
        closeModals();
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDelete = async () => {
    setIsProcessing(true);
    const result = await deleteCategoryAction(categoryToDelete.id);
    setIsProcessing(false);
    if (result.success) {
      closeModals();
      router.refresh();
    }
  };

  const inputStyles = "w-full bg-slate-50 border border-slate-200 px-5 py-3.5 text-sm font-light text-slate-800 focus:outline-none focus:bg-white focus:border-[#fce3de] rounded-2xl transition-all";
  const actionIconStyles = "p-2.5 text-slate-400 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors";

  return (
    <div className="flex flex-col gap-8 text-slate-700 font-sans font-light min-h-screen p-2 md:p-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl text-slate-950 font-normal tracking-tight">Category Directory</h1>
          <p className="text-sm text-slate-500 mt-1 font-light">Curate your silhouette collections</p>
        </div>
        {isSuperAdmin && (
          <button onClick={openAddModal} className="bg-[#fce3de] text-slate-700 px-6 py-3.5 text-xs font-medium uppercase tracking-widest rounded-2xl hover:bg-[#f8cfc9] transition-all cursor-pointer shadow-black/10 active:scale-95">
            Add Category
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-xs font-medium text-slate-500 ml-1 italic font-serif">Search Category</label>
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && updateFilters(1)}
            className={inputStyles} 
          />
        </div>
        <button onClick={() => updateFilters(1)} className="bg-[#fce3de] text-slate-700 px-8 py-4 text-xs font-medium uppercase tracking-widest rounded-2xl cursor-pointer hover:bg-[#f8cfc9]  shadow-black/5 active:scale-95">Search</button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#fdfaf9] border-b border-[#fce3de]/50 text-xs font-medium text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-6 w-24">Visual</th>
                <th className="px-5 py-6">Name</th>
                <th className="px-5 py-6">Subtitle</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {initialCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-light italic">No categories found.</td>
                </tr>
              ) : (
                initialCategories.map((category) => (
                  <tr key={category.id} className="border-b border-slate-50 hover:bg-[#fdfaf9]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="w-16 h-12 relative rounded-lg overflow-hidden border border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                        {category.image ? (
                          <Image src={category.image} alt={category.name} fill className="object-cover" sizes="64px" />
                        ) : (
                          <span className="text-[10px] text-slate-300">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-6 font-medium text-slate-900">{category.name}</td>
                    <td className="px-5 py-6 text-slate-500 italic">{category.subtitle || '-'}</td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => openEditModal(category)} className={actionIconStyles} title="Edit">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setCategoryToDelete(category)} className={actionIconStyles} title="Delete">
                          <svg className="w-5 h-5 stroke-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6 transform transition-all">
            <h2 className="text-2xl font-serif text-slate-900 border-b border-slate-50 pb-4">
              {modalMode === 'add' ? 'New Silhouette' : 'Edit Silhouette'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Internal Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. crossbody-bags" className={inputStyles} />
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} placeholder="e.g. Hands-Free Elegance" className={inputStyles} />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Visual Preview</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl relative flex items-center justify-center overflow-hidden">
                    {/* Prioritize Local Preview URL, fallback to existing DB image */}
                    {(previewUrl || formData.image) ? (
                      <Image src={previewUrl || formData.image} alt="Preview" fill className="object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="category-upload" />
                    <label htmlFor="category-upload" className="inline-block bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#fce3de] transition-colors">
                      {selectedFile ? 'Change Choice' : 'Choose Image'}
                    </label>
                    <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">Will be uploaded on save</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModals} disabled={isProcessing} className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs uppercase cursor-pointer font-bold tracking-widest text-slate-400 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-black text-white rounded-2xl text-xs uppercase font-bold tracking-widest hover:bg-[#fa8791] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-black/10">
                  {isProcessing ? 'Processing...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center flex flex-col gap-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 text-rose-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 className="text-xl font-serif text-slate-900">Remove Category?</h3>
            <p className="text-sm text-slate-500 font-light px-4 leading-relaxed">
              Deleting <span className="font-bold text-slate-900">{categoryToDelete.name}</span> is permanent and cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button onClick={closeModals} disabled={isProcessing} className="flex-1 py-3 cursor-pointer bg-slate-50 rounded-xl text-[10px] font-bold uppercase text-slate-400 transition-colors">Cancel</button>
              <button onClick={executeDelete} disabled={isProcessing} className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-rose-500/20 cursor-pointer active:scale-95 transition-all">
                {isProcessing ? '...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}