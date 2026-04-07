'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitReview } from '@/services/productServices'; // Adjust path if needed

export default function ProductReviews({ productId, initialReviews = [] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamically calculate from the connected reviews
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !comment.trim()) return;

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
      
      setUserName('');
      setUserEmail('');
      setComment('');
      setRating(5);
      setShowForm(false);
      
      // Refresh parent page data so the top stars update instantly!
      router.refresh();

    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="mt-32 border-t border-[#1a1a1a]/10 pt-24 scroll-mt-24">
      
      {/* --- HEADER AREA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6 text-[#1a1a1a]">Client Experience</h2>
          
          <div className="flex items-center gap-6">
            {reviewCount > 0 ? (
              <>
                <span className="text-6xl font-light text-[#1a1a1a]">{averageRating}</span>
                <div className="flex flex-col gap-1.5">
                  {/* Read-only Gold Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-[#e6b93d]' : 'fill-[#e5e5e5]'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-[#888] font-medium">
                    Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-xs uppercase tracking-widest text-[#888] font-light leading-relaxed">
                No reviews yet. Be the first to share your experience.
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="border-b border-[#1a1a1a] pb-1.5 text-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#666] hover:border-[#666] transition-all duration-300"
        >
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* --- REVIEW SUBMISSION FORM --- */}
      <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${showForm ? 'max-h-[800px] opacity-100 mb-20' : 'max-h-0 opacity-0'}`}>
        <form onSubmit={handleSubmit} className="bg-[#faf9f8] border border-[#e5e5e5] p-8 md:p-12 max-w-3xl relative">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a1a1a] mb-8">Share Your Thoughts</h3>
          
          <div className="space-y-7">
            
            {/* Interactive Gold Star Rating */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#888] font-medium mb-3 block">Overall Rating</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                  >
                    <svg className={`w-7 h-7 transition-colors duration-300 ${(hoverRating || rating) >= star ? 'fill-[#e6b93d]' : 'fill-[#e5e5e5]'}`} viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-medium">Name</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full bg-white border border-[#e5e5e5] px-5 py-3.5 text-sm font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all rounded-sm"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#888] font-medium">Email</label>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-[#e5e5e5] px-5 py-3.5 text-sm font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all rounded-sm"
                />
              </div>
            </div>

            {/* Comment Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-[#888] font-medium">Review</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows="4"
                className="w-full bg-white border border-[#e5e5e5] px-5 py-3.5 text-sm font-light text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all rounded-sm resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1a1a1a] text-white px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#e6b93d] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* --- REVIEWS GRID --- */}
      {reviewCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {reviews.map((review) => {
            const dateObj = new Date(review.created_at);
            const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            return (
              <div key={review.id} className="group flex flex-col gap-4">
                
                {/* Stars & Date aligned cleanly */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#e6b93d]' : 'fill-[#e5e5e5]'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#888] uppercase tracking-widest font-medium">{formattedDate}</span>
                </div>
                
                {/* Review Content */}
                <div>
                  <h4 className="text-sm font-bold mb-2 text-[#1a1a1a] tracking-wide">{review.user_name}</h4>
                  <p className="text-[#4a4a4a] text-sm font-light leading-relaxed">"{review.comment}"</p>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}