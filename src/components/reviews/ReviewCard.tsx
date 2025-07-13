import React from 'react';
import Image from 'next/image';

export interface Review {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  rating: number;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ReviewCardProps {
  review: Review;
  showVehicle?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showVehicle = true }) => {
  // Format date
  const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index}
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-neutral-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm transition-all hover:shadow-md overflow-hidden">
      {/* Review Header */}
      <div className="p-5 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 bg-neutral-100">
              {review.authorAvatar ? (
                <Image 
                  src={review.authorAvatar}
                  alt={review.author}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <svg className="h-full w-full text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-medium text-sm">{review.author}</div>
              {review.authorRole && (
                <div className="text-xs text-neutral-500">{review.authorRole}</div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm font-medium text-neutral-900">{review.rating}.0</span>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="p-5">
        {showVehicle && (
          <div className="flex items-center mb-3 pb-3 border-b border-neutral-100">
            <div className="relative h-16 w-20 flex-shrink-0 rounded-md overflow-hidden mr-3 bg-neutral-100">
              <Image 
                src={review.vehicleImage}
                alt={review.vehicleTitle}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-900">{review.vehicleTitle}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                  Purchased via BidVista
                </span>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-neutral-700 text-sm leading-relaxed mb-3">{review.content}</p>
        
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center">
            <span className="mr-3">{formattedDate}</span>
            {review.verified && (
              <span className="flex items-center text-green-600 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center">
            <button className="flex items-center text-neutral-500 hover:text-neutral-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>Helpful ({review.helpful})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
