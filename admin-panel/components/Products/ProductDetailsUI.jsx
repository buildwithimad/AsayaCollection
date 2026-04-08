'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EditProductModal from './EditProductModal'; // Import the new modal!

export default function ProductDetailsUI({ product }) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
  };

  const refreshData = () => {
    router.refresh();
  };

  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <div className="flex flex-col gap-6 text-slate-700 font-sans font-light  min-h-screen p-4 md:p-8">
      
      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={product} 
        refreshData={refreshData} 
      />

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <Link 
            href="/products" 
            className="text-xs font-light text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 mb-3"
          >
            &larr; Back to Catalog
          </Link>
          <h1 className="text-3xl font-normal text-slate-800 tracking-tight">
            {product.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-light tracking-wide">
            SKU / Slug: <span className="text-slate-600 uppercase">{product.slug}</span>
          </p>
        </div>

        <div className="flex gap-3">
         
          
          {/* 🌟 Trigger Modal Here */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-[#fce3de] text-slate-700 cursor-pointer px-6 py-2.5 text-sm font-normal hover:bg-[#f8c6bd] transition-all rounded-xl"
          >
            Edit Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: GALLERY & CONTENT --- */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Images Gallery */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 mb-6">Visual Gallery</h2>
            {images.length === 0 ? (
              <div className="w-full h-64 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                <span className="text-slate-400 font-light text-sm italic">No images available for this product</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 transition-transform hover:scale-[1.02]">
                    <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description Block */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 mb-6">Product Story</h2>
            <div className="text-base text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
              {product.description || 'The story for this product has not been written yet.'}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: COMMERCE & DATA --- */}
        <div className="flex flex-col gap-6">
          
          {/* Commerce / Pricing Box */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 mb-6">Financials</h2>
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-slate-400 font-light">Current Price</span>
                <span className="text-2xl font-normal text-slate-900 tracking-tight">{formatMoney(product.price)}</span>
              </div>
              
              {product.compare_price && (
                <div className="flex justify-between items-center py-4 border-y border-slate-50">
                  <span className="text-sm text-slate-400 font-light">Original Value</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-light text-slate-400 line-through">{formatMoney(product.compare_price)}</span>
                    <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest mt-1">Save {product.discount}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mt-8">
               <h3 className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-3">Attributes</h3>
               <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] rounded-full uppercase tracking-tighter border border-slate-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Features Box */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 mb-6">Key Features</h2>
            <ul className="space-y-4">
              {product.details?.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-light">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-indigo-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics & Operations */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-400 mb-6">Inventory Control</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-slate-300">Warehouse Stock</span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest ${product.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {product.stock} Units
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase">Sales</span>
                  <span className="text-lg font-light tracking-tight">{product.sales_count}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase">Rating</span>
                  <span className="text-lg font-light tracking-tight">⭐ {product.rating}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-3 tracking-widest">Store Visibility</span>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-light w-full justify-center border ${product.is_published ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-slate-700 text-slate-400 bg-slate-800'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.is_published ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  {product.is_published ? 'Live in Boutique' : 'Hidden from Public'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}