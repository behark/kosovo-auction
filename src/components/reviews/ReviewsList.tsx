import React, { useState } from 'react';
import ReviewCard, { Review } from './ReviewCard';
import { Button } from '@/components/ui/Button';

interface ReviewsListProps {
  reviews: Review[];
  title?: string;
  description?: string;
  showVehicle?: boolean;
  className?: string;
  initialDisplayCount?: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  title = "Customer Reviews",
  description,
  showVehicle = true,
  className = "",
  initialDisplayCount = 3
}) => {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  // Filter reviews by rating if selected
  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;
  
  // Sort reviews by selected criteria
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.helpful - a.helpful;
    }
  });

  // Calculate displayed reviews
  const displayedReviews = sortedReviews.slice(0, displayCount);
  const hasMoreReviews = displayCount < sortedReviews.length;

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  // Count reviews by rating
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  // Generate rating filter buttons
  const ratingFilters = [5, 4, 3, 2, 1].map(rating => {
    const count = ratingCounts[rating - 1];
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
    
    return (
      <button
        key={rating}
        className={`flex items-center text-sm hover:bg-neutral-100 rounded-md p-1.5 transition-colors ${
          selectedRating === rating ? 'bg-neutral-100 font-medium' : ''
        }`}
        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
      >
        <div className="flex mr-2">
          {Array(5).fill(0).map((_, index) => (
            <svg 
              key={index}
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-neutral-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className="flex-grow w-32 mr-2">
          <div className="bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-600 h-full rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="text-neutral-500 w-8 text-right">{count}</div>
      </button>
    );
  });

  return (
    <div className={`${className}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          {description && <p className="text-neutral-600 mt-1">{description}</p>}
          
          <div className="mt-4 flex items-center">
            <div className="flex items-center">
              <div className="flex mr-2">
                {Array(5).fill(0).map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      index < Math.floor(averageRating)
                        ? 'text-yellow-400'
                        : index < Math.ceil(averageRating) && Math.ceil(averageRating) > Math.floor(averageRating)
                        ? 'text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-semibold text-neutral-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-neutral-500 mx-2">•</span>
              <span className="text-neutral-500">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0">
          <Button 
            variant="outline" 
            size="default" 
            className="w-full md:w-auto"
            onClick={() => {
              // In a real app, this would navigate to a write review page or open a modal
              alert('Review form would open here');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters - Left Column */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 bg-white p-4 rounded-lg border border-neutral-200">
            <div className="mb-4">
              <h3 className="font-medium text-neutral-900 mb-2">Filter by Rating</h3>
              <div className="space-y-1">{ratingFilters}</div>
            </div>
            
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="font-medium text-neutral-900 mb-2">Sort by</h3>
              <div className="flex flex-col space-y-1">
                <button 
                  className={`text-left px-2 py-1.5 text-sm rounded-md ${sortBy === 'recent' ? 'bg-neutral-100 font-medium' : 'hover:bg-neutral-50'}`}
                  onClick={() => setSortBy('recent')}
                >
                  Most Recent
                </button>
                <button 
                  className={`text-left px-2 py-1.5 text-sm rounded-md ${sortBy === 'helpful' ? 'bg-neutral-100 font-medium' : 'hover:bg-neutral-50'}`}
                  onClick={() => setSortBy('helpful')}
                >
                  Most Helpful
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews - Right Column */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {displayedReviews.length > 0 ? (
            <>
              <div className="space-y-6">
                {displayedReviews.map(review => (
                  <ReviewCard key={review.id} review={review} showVehicle={showVehicle} />
                ))}
              </div>

              {hasMoreReviews && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setDisplayCount(prev => prev + initialDisplayCount)}
                  >
                    Load More Reviews
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-neutral-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">No Reviews Yet</h3>
              <p className="text-neutral-600 mb-4">Be the first to review this vehicle</p>
              <Button 
                variant="default" 
                size="default"
                onClick={() => {
                  // In a real app, this would navigate to a write review page or open a modal
                  alert('Review form would open here');
                }}
              >
                Write a Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
