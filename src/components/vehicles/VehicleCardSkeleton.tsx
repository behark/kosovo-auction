import React from 'react';

interface VehicleCardSkeletonProps {
  count?: number;
}

const VehicleCardSkeleton: React.FC<VehicleCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div 
          key={index} 
          className="animate-pulse rounded-lg border border-neutral-200 bg-white overflow-hidden"
          aria-hidden="true"
        >
          {/* Image placeholder */}
          <div className="h-48 bg-neutral-200" />
          
          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3" />
            
            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
            </div>
            
            {/* Price */}
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-neutral-200 rounded w-1/4" />
              <div className="h-8 bg-neutral-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default VehicleCardSkeleton;
