import React, { useState } from 'react';
import Image from 'next/image';

interface VehicleGalleryProps {
  images: string[];
  title: string;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(0);

  // If no images are provided, show placeholders
  const galleryImages = images.length > 0 
    ? images 
    : ['/images/vehicles/placeholder.jpg', '/images/vehicles/placeholder.jpg', '/images/vehicles/placeholder.jpg'];

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        <Image
          src={galleryImages[activeImage]}
          alt={`${title} - Image ${activeImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
          priority={activeImage === 0}
        />
        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
          {activeImage + 1} / {galleryImages.length}
        </div>
        
        {/* Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
        
        {/* Full-Screen Button */}
        <button
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md transition-colors hover:bg-white"
          aria-label="View full screen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>
      
      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 overflow-hidden rounded border-2 ${
                index === activeImage ? 'border-primary-500' : 'border-neutral-200'
              }`}
            >
              <div className="relative h-16 w-24">
                <Image
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleGallery;
