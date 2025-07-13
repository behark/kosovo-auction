import React, { useState, useRef, useEffect } from 'react';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';

interface SearchOption {
  id: string | number;
  label: string;
  group?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onOptionSelect?: (option: SearchOption) => void;
  options?: SearchOption[];
  initialValue?: string;
  className?: string;
  autoFocus?: boolean;
  showAdvancedFilters?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onOptionSelect,
  options = [],
  initialValue = '',
  className = '',
  autoFocus = false,
  showAdvancedFilters = false,
}) => {
  const [query, setQuery] = useState<string>(initialValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: boolean}>({
    makes: true,
    models: true,
    years: true,
    features: false,
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { getAccessibleProps } = useKeyboardAccessible();

  // Filter options based on query and selected filters
  const filteredOptions = options.filter(option => {
    if (!query.trim()) return false;
    
    // Check if the option's group is in selected filters
    if (option.group && !selectedFilters[option.group.toLowerCase()]) {
      return false;
    }
    
    return option.label.toLowerCase().includes(query.toLowerCase());
  });

  // Group options by their group property
  const groupedOptions: {[key: string]: SearchOption[]} = {};
  filteredOptions.forEach(option => {
    const group = option.group || 'Other';
    if (!groupedOptions[group]) {
      groupedOptions[group] = [];
    }
    groupedOptions[group].push(option);
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setHighlightedIndex(-1);
  };

  // Handle search submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(query);
    setIsOpen(false);
  };

  // Handle option click
  const handleOptionClick = (option: SearchOption) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
    setQuery(option.label);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle filter toggle
  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Scroll to highlighted option
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-12 rounded-md border border-neutral-300 
                     dark:border-neutral-600 bg-white dark:bg-neutral-800 
                     text-neutral-800 dark:text-neutral-200 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `option-${filteredOptions[highlightedIndex]?.id}` : undefined
          }
        />
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 
                         dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 
                         dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 
                         focus:ring-primary-500"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Filter button */}
          {showAdvancedFilters && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500
                ${showFilters 
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
              aria-controls="search-filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="p-1 text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 
                       dark:hover:bg-primary-600 rounded-md focus:outline-none focus:ring-2 
                       focus:ring-primary-500"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>

      {/* Advanced filters dropdown */}
      {showFilters && showAdvancedFilters && (
        <div 
          id="search-filters"
          className="absolute z-10 mt-2 w-full bg-white dark:bg-neutral-800 border 
                    border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-2 px-3"
          ref={dropdownRef}
        >
          <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Search in:
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500 
                           border-neutral-300 dark:border-neutral-600 rounded"
                checked={selectedFilters.makes} 
                onChange={() => handleFilterToggle('makes')}
              />
              <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Makes</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500 
                           border-neutral-300 dark:border-neutral-600 rounded"
                checked={selectedFilters.models} 
                onChange={() => handleFilterToggle('models')}
              />
              <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Models</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500 
                           border-neutral-300 dark:border-neutral-600 rounded"
                checked={selectedFilters.years} 
                onChange={() => handleFilterToggle('years')}
              />
              <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Years</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500 
                           border-neutral-300 dark:border-neutral-600 rounded"
                checked={selectedFilters.features} 
                onChange={() => handleFilterToggle('features')}
              />
              <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Features</span>
            </label>
          </div>
        </div>
      )}

      {/* Results dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <div 
          id="search-results"
          className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border 
                   border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg 
                   max-h-60 overflow-y-auto"
          ref={dropdownRef}
          role="listbox"
        >
          {Object.entries(groupedOptions).map(([group, options]) => (
            <div key={group}>
              <div className="sticky top-0 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 
                           text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                {group}
              </div>
              {options.map((option, index) => {
                const optionIndex = filteredOptions.findIndex(o => o.id === option.id);
                const isHighlighted = highlightedIndex === optionIndex;
                
                return (
                  <div
                    key={option.id}
                    data-index={optionIndex}
                    id={`option-${option.id}`}
                    {...getAccessibleProps(() => handleOptionClick(option))}
                    role="option"
                    aria-selected={isHighlighted}
                    className={`px-4 py-2 cursor-pointer ${
                      isHighlighted
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
