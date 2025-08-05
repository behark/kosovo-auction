import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/components/vehicles/VehicleCard';

interface SearchFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
  condition?: string;
  isAuction?: boolean;
}

interface VehicleSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  vehicles: Vehicle[];
  isLoading?: boolean;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onFiltersChange,
  vehicles,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique values from vehicles for dropdown options
  const getUniqueValues = (key: keyof Vehicle) => {
    return [...new Set(vehicles.map(vehicle => vehicle[key]).filter(Boolean))] as string[];
  };

  const makes = getUniqueValues('make').sort();
  const fuelTypes = getUniqueValues('fuelType').sort();
  const locations = getUniqueValues('location').sort();

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Search Vehicles</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAdvanced ? 'Simple Search' : 'Advanced Search'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Make Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </label>
            <select
              value={filters.make || ''}
              onChange={(e) => updateFilters({ make: e.target.value || undefined })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Makes</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price (€)
            </label>
            <input
              type="number"
              placeholder="Maximum price"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilters({ 
                priceMax: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Year
            </label>
            <select
              value={filters.yearMin || ''}
              onChange={(e) => updateFilters({ 
                yearMin: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Year</option>
              {Array.from({ length: 30 }, (_, i) => currentYear - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={filters.location || ''}
              onChange={(e) => updateFilters({ location: e.target.value || undefined })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="Enter model"
                  value={filters.model || ''}
                  onChange={(e) => updateFilters({ model: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType || ''}
                  onChange={(e) => updateFilters({ fuelType: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Fuel Types</option>
                  {fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={filters.transmission || ''}
                  onChange={(e) => updateFilters({ transmission: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Transmissions</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="semi-automatic">Semi-automatic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (€)
                </label>
                <input
                  type="number"
                  placeholder="Minimum price"
                  value={filters.priceMin || ''}
                  onChange={(e) => updateFilters({ 
                    priceMin: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Year
                </label>
                <select
                  value={filters.yearMax || ''}
                  onChange={(e) => updateFilters({ 
                    yearMax: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Year</option>
                  {Array.from({ length: 30 }, (_, i) => currentYear - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Mileage (km)
                </label>
                <select
                  value={filters.mileageMax || ''}
                  onChange={(e) => updateFilters({ 
                    mileageMax: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Mileage</option>
                  <option value={10000}>Under 10,000 km</option>
                  <option value={25000}>Under 25,000 km</option>
                  <option value={50000}>Under 50,000 km</option>
                  <option value={100000}>Under 100,000 km</option>
                  <option value={150000}>Under 150,000 km</option>
                  <option value={200000}>Under 200,000 km</option>
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={filters.condition || ''}
                  onChange={(e) => updateFilters({ condition: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-owned">Certified Pre-owned</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isAuction === true}
                    onChange={(e) => updateFilters({ 
                      isAuction: e.target.checked ? true : undefined 
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auction Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              `${vehicles.length} vehicles found`
            )}
          </div>
          
          <div className="space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear All
            </button>
            <button
              onClick={() => onFiltersChange(filters)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearch;
