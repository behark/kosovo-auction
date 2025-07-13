import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import useInView from '@/hooks/useInView';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  placeholderColor?: string;
  transitionDuration?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderColor = '#f3f4f6',
  transitionDuration = 500,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholderColor }}
      aria-label={alt || "Image"}
    >
      {isInView && (
        <>
          <Image 
            src={src}
            alt={alt || ""}
            onLoad={handleLoad}
            className={`transition-opacity duration-${transitionDuration} ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            {...props}
          />
          
          {!isLoaded && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-neutral-200"
              aria-hidden="true"
            >
              <svg 
                className="h-12 w-12 text-neutral-400 animate-pulse" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;
