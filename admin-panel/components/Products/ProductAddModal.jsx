'use client';

import { useState, useEffect } from 'react';
import { createProductAction, getCategories } from '@/app/action/productService';
import Image from 'next/image';

export default function AddProductModal({ isOpen, onClose, refreshData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  
  // 🌟 New State for Published Toggle (Defaults to true/Live)
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories);
      setIsPublished(true); // Reset to Live on new open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  console.log("Categories for Dropdown:", categories); // Debugging line

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createProductAction(formData);
    setIsLoading(false);
    if (result.success) {
      refreshData();
      onClose();
    } else {
      alert("Error: " + result.message);
    }
  };

  const inputStyles = "w-full bg-slate-50 border border-slate-200 px-5 py-4 text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-slate-700 outline-none placeholder:text-slate-400";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] border border-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-[#fdfbfb]">
          <div>
            <h2 className="text-2xl font-normal text-slate-800 tracking-tight">Create Masterpiece</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-light">Product Integration System</p>
          </div>
          <div className="flex items-center gap-6">
            {/* 🌟 Visibility Status Toggle at the top right */}
            <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-full">
              <span className={`text-[10px] font-medium uppercase tracking-widest ${isPublished ? 'text-emerald-500' : 'text-slate-400'}`}>
                {isPublished ? 'Published' : 'Draft'}
              </span>
              <button 
                type="button" 
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${isPublished ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${isPublished ? 'translate-x-4.5' : 'translate-x-1'}`} />
              </button>
            </div>

            <button 
              onClick={onClose} 
              className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex flex-col gap-8 custom-scrollbar">
          
          {/* Hidden input to pass the toggle state to the server action */}
          <input type="hidden" name="is_published" value={isPublished} />

          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-indigo-500 mb-4">General Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-500 ml-1">Product Title</label>
                <input type="text" name="name" required placeholder="Ex: Midnight Oud Collection" className={inputStyles} />
              </div>
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-500 ml-1">Story / Description</label>
                <textarea name="description" rows="4" placeholder="Describe the essence of this product..." className={`${inputStyles} resize-none font-light leading-relaxed`} />
              </div>
            </div>
          </div>

          {/* Section 2: Logistics & Commercials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-50 pt-8">
            <div className="space-y-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-indigo-500 mb-4">Financials</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 ml-1">Selling Price</label>
                  <input type="number" name="price" required placeholder="0.00" className={inputStyles} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 ml-1">Compare Price</label>
                  <input type="number" name="compare_price" placeholder="0.00" className={inputStyles} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Inventory Stock</label>
                <input type="number" name="stock" required placeholder="Quantity" className={inputStyles} />
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-indigo-500 mb-4">Categorization</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Category</label>
                <div className="relative">
                  <select name="category_id" className={`${inputStyles} appearance-none cursor-pointer pr-10`}>
                    <option value="">Select Master Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">Meta Tags (Comma separated)</label>
                <input type="text" name="tags" placeholder="premium, niche, floral" className={inputStyles} />
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Specifications */}
          <div className="space-y-4 border-t border-slate-50 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-indigo-500">Key Feature Bullets</h3>
              <span className="text-[10px] text-slate-300 font-light tracking-wider">ONE POINT PER LINE</span>
            </div>
            <textarea name="details" rows="3" placeholder="Long lasting 12h+&#10;Hand-crafted notes&#10;Sustainable packaging" className={`${inputStyles} resize-none font-light`} />
          </div>

          {/* Section 4: Media Assets */}
          <div className="space-y-4 border-t border-slate-50 pt-8">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-indigo-500 mb-4">Visual Assets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="group relative aspect-[3/4] border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden hover:border-indigo-300 hover:bg-slate-50 transition-all duration-500 cursor-pointer">
                  {imagePreviews[i] ? (
                    <Image src={imagePreviews[i]} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mx-auto transition-all">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-medium">Slot {i + 1}</p>
                    </div>
                  )}
                  <input type="file" name={`image${i + 1}`} onChange={(e) => handleImageChange(e, i)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-50 flex justify-end gap-4 bg-white sticky bottom-0 mt-auto">
            <button type="button" onClick={onClose} className="px-8 py-4 text-sm font-light text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
              Discard
            </button>
            <button type="submit" disabled={isLoading} className="bg-slate-900 text-white px-10 py-4 text-sm font-normal rounded-2xl hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-indigo-500/10 cursor-pointer">
              {isLoading ? 'Saving...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}