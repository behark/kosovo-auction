import React from 'react';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';

interface ReviewStarsProps {
  rating: number;
  maxRating?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  precision?: 0.5 | 1;
  onChange?: (rating: number) => void;
  className?: string;
  emptyColor?: string;
  filledColor?: string;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  maxRating = 5,
  readOnly = true,
  size = 'md',
  showCount = false,
  count = 0,
  precision = 1,
  onChange,
  className = '',
  emptyColor = 'text-neutral-300 dark:text-neutral-600',
  filledColor = 'text-yellow-400 dark:text-yellow-500',
}) => {
  const { getAccessibleProps } = useKeyboardAccessible();
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [activeRating, setActiveRating] = React.useState<number>(rating);

  React.useEffect(() => {
    setActiveRating(rating);
  }, [rating]);

  // Determine star size based on prop
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  const starSize = sizeClasses[size];

  // Handle star click
  const handleStarClick = (clickedRating: number) => {
    if (readOnly) return;
    
    const newRating = clickedRating === activeRating ? clickedRating - 1 : clickedRating;
    setActiveRating(newRating);
    
    if (onChange) {
      onChange(newRating);
    }
  };

  // Handle star hover
  const handleStarHover = (hoveredRating: number) => {
    if (readOnly) return;
    setHoverRating(hoveredRating);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  // Format count text (e.g., "123" to "123", "1234" to "1.2k")
  const formatCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 10000) return (Math.floor(count / 100) / 10).toString() + 'k';
    if (count < 1000000) return Math.floor(count / 1000).toString() + 'k';
    return (Math.floor(count / 100000) / 10).toString() + 'm';
  };

  // Get the display rating (either hovered or active)
  const displayRating = hoverRating > 0 ? hoverRating : activeRating;

  // Generate stars
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    // For half-star precision, we check if the current star should be half-filled
    const isHalfFilled = precision === 0.5 && Math.ceil(displayRating) === i && displayRating !== i;
    const isFilled = i <= displayRating;
    
    stars.push(
      <span
        key={i}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarHover(i)}
        role={readOnly ? undefined : 'button'}
        aria-label={readOnly ? undefined : `Rate ${i} out of ${maxRating}`}
        className={`cursor-${readOnly ? 'default' : 'pointer'}`}
        {...(readOnly ? {} : getAccessibleProps(() => handleStarClick(i)))}
      >
        {isHalfFilled ? (
          // Half filled star
          <span className="relative inline-block">
            {/* Empty star background */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={`${starSize} ${emptyColor}`}
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Half filled overlay */}
            <span className="absolute top-0 left-0 overflow-hidden w-1/2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className={`${starSize} ${filledColor}`}
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </span>
        ) : (
          // Fully filled or empty star
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className={`${starSize} ${isFilled ? filledColor : emptyColor}`}
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </span>
    );
  }

  return (
    <div 
      className={`flex items-center ${className}`}
      onMouseLeave={handleMouseLeave}
      aria-label={`Rating: ${activeRating} out of ${maxRating}`}
    >
      <div className="flex">{stars}</div>
      {showCount && (
        <div className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
          ({formatCount(count)})
        </div>
      )}
    </div>
  );
};

export default ReviewStars;
