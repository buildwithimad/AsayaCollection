'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddProductModal from './ProductAddModal';
import EditProductModal from './EditProductModal';
import { deleteProductAction } from '@/app/action/productService'; // 🌟 Import the action!

export default function ProductsUI({ initialProducts, totalCount, currentPage, currentSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [search, setSearch] = useState(currentSearch);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
  // 🌟 New Delete States
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- PAGINATION LOGIC ---
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const updateFilters = (newPage = 1) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    if (search) params.set('search', search);
    else params.delete('search');
    router.push(`${pathname}?${params.toString()}`);
  };

  const refreshData = () => {
    router.refresh(); 
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  // 🌟 Secure Delete Execution
  const executeDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    
    const result = await deleteProductAction(productToDelete.id);
    
    setIsDeleting(false);
    if (result.success) {
      setProductToDelete(null); // Close modal
      refreshData(); // Refresh table
    } else {
      alert("Failed to delete product: " + result.message);
    }
  };

  const actionIconStyles = "p-2 text-slate-400 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50";

  return (
    <div className="flex flex-col gap-8 text-slate-700 font-sans font-light  min-h-screen p-4 md:p-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl text-slate-950 font-normal tracking-tight">Product Catalog</h1>
          <p className="text-sm text-slate-500 mt-1 font-light">Manage your boutique inventory securely</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#fce3de] text-slate-700 px-6 py-3 text-sm font-normal rounded-xl hover:bg-[#f8cfc9] active:scale-95 transform transition-all  cursor-pointer"
        >
          + Add New Product
        </button>
      </div>

      {/* --- MODALS --- */}
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} refreshData={refreshData} />
      <EditProductModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} product={productToEdit} refreshData={refreshData} />

      {/* 🌟 LUXURY DELETE WARNING MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center transform transition-all">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-normal text-slate-900 mb-2">Delete Product?</h2>
            <p className="text-sm text-slate-500 font-light mb-8 leading-relaxed">
              Are you sure you want to permanently remove <span className="font-medium text-slate-800">"{productToDelete.name}"</span>? This action cannot be undone and will remove it entirely from your boutique.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3.5 text-sm font-light text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Keep Product
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex-1 py-3.5 text-sm font-normal text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                ) : 'Yes, Delete It'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FILTER BAR --- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); updateFilters(1); }} className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="w-full max-w-lg space-y-1.5 flex-grow">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Search Catalog</label>
            <input 
              type="text" placeholder="Search by name or slug..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 text-sm font-light text-slate-700 focus:outline-none focus:bg-white focus:border-[#fce3de] focus:ring-4 focus:ring-[#fce3de]/30 transition-all rounded-2xl placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#fce3de] text-slate-900 cursor-pointer px-7 py-3.5 text-sm font-normal rounded-2xl hover:bg-[#fa8791] hover:text-white transition-all shadow-sm active:scale-95">
              Search
            </button>
            {currentSearch && (
              <button type="button" onClick={() => { setSearch(''); router.push(pathname); }} className="bg-white text-slate-700 border border-slate-200 px-7 py-3.5 text-sm font-light hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#fdfaf9] border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-5 font-medium w-24">Image</th>
                <th className="px-5 py-5 font-medium">Product Info</th>
                <th className="px-5 py-5 font-medium">Price</th>
                <th className="px-5 py-5 font-medium text-center">Stock</th>
                <th className="px-5 py-5 font-medium text-center">Visibility</th>
                <th className="px-8 py-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-slate-700">
              {initialProducts.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-light italic">No products found in the catalog.</td></tr>
              ) : (
                initialProducts.map((product) => {
                  const mainImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;

                  return (
                    <tr key={product.id} className="border-b border-slate-50 hover:bg-[#fdfaf9]/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl relative overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center shadow-inner">
                          {mainImage ? (
                            <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <svg className="w-6 h-6 stroke-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-normal text-slate-900 text-base">{product.name}</span>
                          <span className="text-xs text-slate-400 tracking-wider uppercase font-mono bg-slate-100 px-2 py-0.5 rounded self-start mt-1">{product.slug}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-col">
                          <span className="font-normal text-base text-slate-900">Rs. {product.price.toLocaleString()}</span>
                          {product.compare_price && <span className="text-xs text-slate-400 line-through">Rs. {product.compare_price.toLocaleString()}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {product.stock} Units
                        </span>
                      </td>
                      <td className="px-5 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium ${product.is_published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${product.is_published ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {product.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-1.5 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          
                          <Link href={`/products/${product.id}`} className={actionIconStyles} title="View Details">
                            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </Link>

                          <button onClick={() => handleOpenEditModal(product)} className={`${actionIconStyles} text-slate-400 hover:text-amber-600 hover:bg-amber-50`} title="Edit Product">
                            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                          </button>

                          {/* 🌟 Delete Button Trigger */}
                          <button onClick={() => setProductToDelete(product)} className={`${actionIconStyles} hover:text-rose-600 hover:bg-rose-50`} title="Delete Product">
                            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-100 rounded-3xl p-5 shadow-sm mt-4">
          <p className="text-sm text-slate-500 font-light">
            Page <span className="text-slate-950 font-normal">{currentPage}</span> of <span className="text-slate-950 font-normal">{totalPages}</span>
            <span className="text-xs text-slate-400 ml-2">({totalCount} total items)</span>
          </p>
          <div className="flex gap-2.5">
            <button onClick={() => updateFilters(currentPage - 1)} disabled={currentPage === 1} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 text-sm font-light hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Previous</button>
            <button onClick={() => updateFilters(currentPage + 1)} disabled={currentPage === totalPages} className="bg-slate-900 text-white px-6 py-2.5 text-sm font-normal hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm">Next</button>
          </div>
        </div>
      )}

    </div>
  );
}