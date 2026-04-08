'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitReview } from '@/services/productServices'; // Adjust path if needed
import { useUser } from '@/context/UserContext'; // 🌟 Import your global user context

export default function ProductReviews({ productId, initialReviews = [] }) {
  const router = useRouter();
  
  // 🌟 Grab the user instantly from the global context
  const user = useUser(); 
  const isLoggedIn = !!user;

  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive name and email dynamically from the user object
  const userName = user?.user_metadata?.full_name || '';
  const userEmail = user?.email || '';

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    if (!userName.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    try {
      const newReviewFromDB = await submitReview({
        product_id: productId,
        user_name: userName,
        user_email: userEmail,
        comment: comment,
        rating: rating,
      });

      const reviewToAdd = newReviewFromDB || {
        id: crypto.randomUUID(), 
        user_name: userName,
        rating: rating,
        comment: comment,
        created_at: new Date().toISOString(),
      };

      setReviews([reviewToAdd, ...reviews]);
      setComment('');
      setRating(5);
      setShowForm(false);
      router.refresh();

    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="mt-40 border-t border-[#1a1a1a]/5 pt-24 scroll-mt-24">
      
      {/* --- HEADER AREA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[#888]">Experience</h2>
          
          <div className="flex items-center gap-8">
            {reviewCount > 0 ? (
              <>
                <span className="text-7xl font-light text-[#1a1a1a] tracking-tighter">{averageRating}</span>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-[#ebb626]' : 'fill-slate-200'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-medium">
                    Verified Clients ({reviewCount})
                  </div>
                </div>
              </>
            ) : (
              <span className="text-sm font-light text-[#888] italic">
                Be the first to leave your signature.
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="group flex items-center gap-3 text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-bold"
        >
          <span className="relative overflow-hidden block">
            <span className={`block transition-transform duration-500 ${showForm ? '-translate-y-full' : 'translate-y-0'}`}>Write a review</span>
            <span className={`absolute top-0 left-0 transition-transform duration-500 ${showForm ? 'translate-y-0' : 'translate-y-full'}`}>Close Form</span>
          </span>
          <span className={`w-8 h-px bg-[#1a1a1a] transition-all duration-500 group-hover:w-12`}></span>
        </button>
      </div>

      {/* --- REVIEW SUBMISSION FORM / LOGIN PROMPT --- */}
      <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${showForm ? 'max-h-[900px] opacity-100 mb-24' : 'max-h-0 opacity-0'}`}>
        <div className="max-w-4xl mx-auto border border-[#f2f0ef] rounded-xl overflow-hidden shadow-sm">
          {!isLoggedIn ? (
            /* --- LOGIN MESSAGE --- */
            <div className="bg-[#faf9f8] p-16 text-center flex flex-col items-center gap-6">
                <svg className="w-10 h-10 text-[#888] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm font-light text-[#555] tracking-wide max-w-xs">
                    To maintain the integrity of our community, please log in to share your experience.
                </p>
                <Link href="/login" className="bg-[#1a1a1a] text-white px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#333] transition-all">
                    Login to Account
                </Link>
            </div>
          ) : (
            /* --- ACTUAL FORM --- */
            <form onSubmit={handleSubmit} className="bg-[#faf9f8] p-10 md:p-16">
              <div className="space-y-12">
                
                {/* Rating */}
                <div className="flex flex-col items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#888] font-semibold">Select Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform duration-300 hover:scale-125"
                      >
                        <svg className={`w-8 h-8 transition-colors duration-500 ${(hoverRating || rating) >= star ? 'fill-[#ebb626]' : 'fill-slate-200'}`} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 opacity-60">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#999] ml-1">Reviewing as</label>
                    <input 
                      type="text" 
                      value={userName}
                      disabled
                      className="w-full bg-white border border-[#eceaea] px-6 py-4 text-sm font-light cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2 opacity-60">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#999] ml-1">Email</label>
                    <input 
                      type="email" 
                      value={userEmail}
                      disabled
                      className="w-full bg-white border border-[#eceaea] px-6 py-4 text-sm font-light cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-[#999] ml-1">Your Experience</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows="5"
                    className="w-full bg-white border border-[#eceaea] px-6 py-4 text-sm font-light focus:outline-none focus:border-[#1a1a1a] transition-all resize-none"
                    placeholder="Tell us about your masterpiece..."
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1a1a1a] text-white px-16 py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#333] transition-all duration-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Experience'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* --- REVIEWS GRID --- */}
      {reviewCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
          {reviews.map((review) => {
            const dateObj = new Date(review.created_at);
            const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            return (
              <div key={review.id} className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#ebb626]' : 'fill-slate-200'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[9px] text-[#aaa] uppercase tracking-widest font-medium">{formattedDate}</span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-[0.1em]">{review.user_name}</h4>
                  <p className="text-[#555] text-sm font-light leading-relaxed italic">"{review.comment}"</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}