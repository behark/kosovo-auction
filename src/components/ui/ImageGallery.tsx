import React, { useState } from 'react';
import LazyImage from './LazyImage';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className={`${className}`}>
      {/* Main image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <button
          className="relative block h-0 w-full pb-[56.25%]" // 16:9 aspect ratio
          onClick={() => openLightbox(activeIndex)}
          aria-label="Open fullscreen gallery"
          type="button"
        >
          <LazyImage
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            priority={activeIndex === 0} // Load first image with priority
          />
        </button>
        
        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Previous image"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Next image"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative h-20 overflow-hidden rounded border-2 focus:outline-none ${
              index === activeIndex
                ? 'border-primary-600'
                : 'border-transparent hover:border-neutral-300'
            }`}
            aria-label={`View image ${index + 1}: ${image.alt}`}
            aria-current={index === activeIndex ? 'true' : 'false'}
            type="button"
          >
            <LazyImage
              src={image.src}
              alt=""
              fill
              sizes="100px"
              className="object-cover"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      
      {/* Fullscreen lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative h-full w-full max-w-6xl p-4">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close fullscreen gallery"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            {/* Main lightbox image */}
            <div className="relative flex h-full items-center justify-center">
              <img
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                className="max-h-full max-w-full object-contain"
              />
              
              {/* Lightbox navigation */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Previous image"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Next image"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            
            {/* Image counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded bg-black/70 px-4 py-2 text-white">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
