import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import PriceRangeSlider from '@/components/ui/PriceRangeSlider';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';
import useMediaQuery from '@/hooks/useMediaQuery';

// Filter option type
interface FilterOption {
  id: string | number;
  label: string;
  count?: number;
}

// Filter section type
interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: FilterOption[];
  isExpanded?: boolean;
  minValue?: number;
  maxValue?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

// Filter values type
interface FilterValues {
  [key: string]: any; // Can be string[] for checkbox, string for radio, or [number, number] for range
}

interface FilterPanelProps {
  sections: FilterSection[];
  initialValues?: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply?: () => void;
  onReset?: () => void;
  className?: string;
  isMobileDrawer?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  sections,
  initialValues = {},
  onChange,
  onApply,
  onReset,
  className = '',
  isMobileDrawer = false,
}) => {
  const [filterValues, setFilterValues] = useState<FilterValues>(initialValues);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: section.isExpanded !== undefined ? section.isExpanded : true
    }), {})
  );
  
  const { getAccessibleProps } = useKeyboardAccessible();
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Update filter values
  const updateFilterValue = (sectionId: string, value: any) => {
    const newValues = {
      ...filterValues,
      [sectionId]: value
    };
    
    setFilterValues(newValues);
    onChange(newValues);
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (sectionId: string, optionId: string | number) => {
    const currentValues = filterValues[sectionId] || [];
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter((id: string | number) => id !== optionId)
      : [...currentValues, optionId];
    
    updateFilterValue(sectionId, newValues);
  };
  
  // Handle radio change
  const handleRadioChange = (sectionId: string, optionId: string | number) => {
    updateFilterValue(sectionId, optionId);
  };
  
  // Handle range change
  const handleRangeChange = (sectionId: string, minVal: number, maxVal: number) => {
    updateFilterValue(sectionId, [minVal, maxVal]);
  };
  
  // Reset all filters
  const handleReset = () => {
    const emptyValues = sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: section.type === 'checkbox' ? [] : 
                    section.type === 'range' && section.minValue !== undefined && section.maxValue !== undefined ? 
                    [section.minValue, section.maxValue] : null
    }), {});
    
    setFilterValues(emptyValues);
    onChange(emptyValues);
    
    if (onReset) {
      onReset();
    }
  };
  
  // Apply filters
  const handleApply = () => {
    if (onApply) {
      onApply();
    }
  };

  // Count active filters
  const countActiveFilters = () => {
    return Object.entries(filterValues).reduce((count, [sectionId, value]) => {
      if (!value) return count;
      
      const section = sections.find(s => s.id === sectionId);
      if (!section) return count;
      
      if (section.type === 'checkbox') {
        return count + (value as Array<any>).length;
      } else if (section.type === 'radio') {
        return count + (value ? 1 : 0);
      } else if (section.type === 'range') {
        const [min, max] = value as [number, number];
        const defaultMin = section.minValue;
        const defaultMax = section.maxValue;
        return count + ((min !== defaultMin || max !== defaultMax) ? 1 : 0);
      }
      
      return count;
    }, 0);
  };
  
  // Render filter section based on type
  const renderFilterSection = (section: FilterSection) => {
    const isExpanded = expandedSections[section.id];
    
    return (
      <div key={section.id} className="border-b border-neutral-200 dark:border-neutral-700 py-4">
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => toggleSection(section.id)}
          {...getAccessibleProps(() => toggleSection(section.id))}
        >
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            {section.title}
            {section.type === 'checkbox' && filterValues[section.id]?.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {filterValues[section.id].length}
              </span>
            )}
            {section.type === 'range' && filterValues[section.id] && 
             (filterValues[section.id][0] !== section.minValue || 
              filterValues[section.id][1] !== section.maxValue) && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                Active
              </span>
            )}
          </h3>
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        
        {isExpanded && (
          <div className="mt-3 space-y-2">
            {section.type === 'checkbox' && section.options && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {section.options.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 
                               border-neutral-300 dark:border-neutral-600 rounded"
                      checked={(filterValues[section.id] || []).includes(option.id)}
                      onChange={() => handleCheckboxChange(section.id, option.id)}
                    />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-neutral-500 dark:text-neutral-400">
                          ({option.count})
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {section.type === 'radio' && section.options && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {section.options.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 
                               border-neutral-300 dark:border-neutral-600"
                      checked={filterValues[section.id] === option.id}
                      onChange={() => handleRadioChange(section.id, option.id)}
                      name={`filter-${section.id}`}
                    />
                    <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-neutral-500 dark:text-neutral-400">
                          ({option.count})
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {section.type === 'range' && section.minValue !== undefined && section.maxValue !== undefined && (
              <PriceRangeSlider
                minPrice={section.minValue}
                maxPrice={section.maxValue}
                step={section.step || 100}
                initialMin={filterValues[section.id]?.[0] || section.minValue}
                initialMax={filterValues[section.id]?.[1] || section.maxValue}
                onChange={(min, max) => handleRangeChange(section.id, min, max)}
                formatValue={section.formatValue || ((value) => `€${value.toLocaleString()}`)}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const activeFiltersCount = countActiveFilters();
  
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm ${className}`}>
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        <button
          onClick={handleReset}
          className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
        >
          Reset all
        </button>
      </div>
      
      <div className="p-4">
        <div className="space-y-1">
          {sections.map(renderFilterSection)}
        </div>
      </div>
      
      {(isMobileDrawer || isMobile) && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3">
          <Button 
            {...{variant: 'outline', size: 'default'} as any} 
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button 
            {...{variant: 'default', size: 'default'} as any} 
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
