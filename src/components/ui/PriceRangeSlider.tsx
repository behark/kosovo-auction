import React, { useState, useEffect, useCallback } from 'react';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  initialMin?: number;
  initialMax?: number;
  step?: number;
  onChange: (minValue: number, maxValue: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  initialMin,
  initialMax,
  step = 100,
  onChange,
  formatValue = (value) => `€${value.toLocaleString()}`,
  className = '',
}) => {
  const [minValue, setMinValue] = useState<number>(initialMin || minPrice);
  const [maxValue, setMaxValue] = useState<number>(initialMax || maxPrice);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  
  const { getAccessibleProps } = useKeyboardAccessible();
  
  // Calculate percentage position for slider thumbs
  const minPos = ((minValue - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPos = ((maxValue - minPrice) / (maxPrice - minPrice)) * 100;
  
  // Handle min slider change
  const handleMinChange = useCallback((value: number) => {
    const newMinValue = Math.min(Math.max(value, minPrice), maxValue - step);
    setMinValue(newMinValue);
    onChange(newMinValue, maxValue);
  }, [maxValue, minPrice, onChange, step]);
  
  // Handle max slider change
  const handleMaxChange = useCallback((value: number) => {
    const newMaxValue = Math.max(Math.min(value, maxPrice), minValue + step);
    setMaxValue(newMaxValue);
    onChange(minValue, newMaxValue);
  }, [maxPrice, minValue, onChange, step]);
  
  // Update when props change
  useEffect(() => {
    setMinValue(initialMin !== undefined ? initialMin : minPrice);
    setMaxValue(initialMax !== undefined ? initialMax : maxPrice);
  }, [initialMin, initialMax, minPrice, maxPrice]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((type: 'min' | 'max') => (e: React.KeyboardEvent) => {
    const changeAmount = e.shiftKey ? step * 10 : step;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (type === 'min') {
          handleMinChange(Math.max(minValue - changeAmount, minPrice));
        } else {
          handleMaxChange(Math.max(maxValue - changeAmount, minValue + step));
        }
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (type === 'min') {
          handleMinChange(Math.min(minValue + changeAmount, maxValue - step));
        } else {
          handleMaxChange(Math.min(maxValue + changeAmount, maxPrice));
        }
        break;
      case 'Home':
        e.preventDefault();
        if (type === 'min') {
          handleMinChange(minPrice);
        } else {
          handleMaxChange(minValue + step);
        }
        break;
      case 'End':
        e.preventDefault();
        if (type === 'min') {
          handleMinChange(maxValue - step);
        } else {
          handleMaxChange(maxPrice);
        }
        break;
    }
  }, [handleMinChange, handleMaxChange, minValue, maxValue, minPrice, maxPrice, step]);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex justify-between">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {formatValue(minValue)}
        </span>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {formatValue(maxValue)}
        </span>
      </div>
      
      <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
        {/* Range bar */}
        <div 
          className="absolute h-full bg-primary-600 rounded-full" 
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }} 
        />
        
        {/* Min thumb */}
        <div 
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 
            bg-white border-2 border-primary-600 rounded-full shadow-md 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
            cursor-pointer hover:scale-110 transition-transform
            ${isDragging === 'min' ? 'z-30' : 'z-20'}
          `}
          style={{ left: `${minPos}%` }}
          {...getAccessibleProps(() => {}, 'slider')}
          tabIndex={0}
          role="slider"
          aria-label="Minimum price"
          aria-valuemin={minPrice}
          aria-valuemax={maxPrice}
          aria-valuenow={minValue}
          aria-valuetext={formatValue(minValue)}
          onKeyDown={handleKeyDown('min')}
        />
        
        {/* Max thumb */}
        <div 
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 
            bg-white border-2 border-primary-600 rounded-full shadow-md 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
            cursor-pointer hover:scale-110 transition-transform
            ${isDragging === 'max' ? 'z-30' : 'z-20'}
          `}
          style={{ left: `${maxPos}%` }}
          {...getAccessibleProps(() => {}, 'slider')}
          tabIndex={0}
          role="slider"
          aria-label="Maximum price"
          aria-valuemin={minPrice}
          aria-valuemax={maxPrice}
          aria-valuenow={maxValue}
          aria-valuetext={formatValue(maxValue)}
          onKeyDown={handleKeyDown('max')}
        />
      </div>
      
      <div className="mt-8 flex justify-between items-center gap-4">
        <div className="flex-1">
          <label htmlFor="min-price-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Min Price
          </label>
          <input
            id="min-price-input"
            type="number"
            min={minPrice}
            max={maxValue - step}
            step={step}
            value={minValue}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md 
                       text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-labelledby="min-price-label"
          />
        </div>
        
        <div className="flex-1">
          <label htmlFor="max-price-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Max Price
          </label>
          <input
            id="max-price-input"
            type="number"
            min={minValue + step}
            max={maxPrice}
            step={step}
            value={maxValue}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md
                       text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-labelledby="max-price-label"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
