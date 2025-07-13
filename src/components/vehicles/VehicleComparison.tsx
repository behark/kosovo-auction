import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import ReviewStars from '@/components/ui/ReviewStars';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';
import { useTheme } from '@/contexts/ThemeContext';

// Vehicle comparison type
interface VehicleForComparison {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  engineSize: string;
  power: string;
  bodyType: string;
  color: string;
  features: string[];
  condition: string;
  location: string;
}

interface VehicleComparisonProps {
  vehicles: VehicleForComparison[];
  onRemoveVehicle: (vehicleId: string) => void;
  onClearAll: () => void;
  className?: string;
}

const VehicleComparison: React.FC<VehicleComparisonProps> = ({
  vehicles,
  onRemoveVehicle,
  onClearAll,
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const { getAccessibleProps } = useKeyboardAccessible();
  
  // Handle SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Skip rendering if no vehicles or not client-side yet
  if (!isClient || vehicles.length === 0) return null;

  // Get all unique features from all vehicles
  const allFeatures = [...new Set(vehicles.flatMap(vehicle => vehicle.features))].sort();
  
  // Group specs for better organization
  const specGroups = [
    {
      title: 'Performance',
      specs: ['mileage', 'fuelType', 'transmission', 'engineSize', 'power']
    },
    {
      title: 'Appearance',
      specs: ['bodyType', 'color']
    },
    {
      title: 'Other',
      specs: ['condition', 'location']
    }
  ];
  
  // Helper function to format price
  const formatPrice = (price: number) => {
    return `€${price.toLocaleString()}`;
  };
  
  // Helper function to format specs
  const formatSpec = (key: string, value: any) => {
    switch (key) {
      case 'mileage':
        return `${value.toLocaleString()} km`;
      default:
        return value;
    }
  };
  
  // Helper function to check if a feature is included
  const hasFeature = (vehicle: VehicleForComparison, feature: string) => {
    return vehicle.features.includes(feature);
  };
  
  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm ${className}`}>
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Compare Vehicles ({vehicles.length})
        </h2>
        <button
          onClick={onClearAll}
          className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
        >
          Clear all
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header row with vehicle info */}
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 sticky left-0 z-10">
                <div className="w-36"></div>
              </th>
              {vehicles.map(vehicle => (
                <th key={vehicle.id} className="p-2 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="w-64 max-w-xs">
                    {/* Vehicle image and name */}
                    <div className="relative mb-2">
                      <button 
                        className="absolute top-0 right-0 p-1 bg-neutral-800 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full m-2 focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => onRemoveVehicle(vehicle.id)}
                        aria-label={`Remove ${vehicle.year} ${vehicle.make} ${vehicle.model} from comparison`}
                        {...getAccessibleProps(() => onRemoveVehicle(vehicle.id))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="relative h-40 rounded-lg overflow-hidden">
                        <Image
                          src={vehicle.imageUrl}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Vehicle name and price */}
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                      <Link href={`/vehicles/${vehicle.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </Link>
                    </h3>
                    <div className="text-lg font-semibold text-primary-600 dark:text-primary-400 mt-1">
                      {formatPrice(vehicle.price)}
                    </div>
                    
                    {/* Rating */}
                    <div className="mt-2">
                      <ReviewStars 
                        rating={vehicle.rating} 
                        showCount={true} 
                        count={vehicle.reviewCount} 
                        size="sm" 
                      />
                    </div>
                    
                    {/* View details button */}
                    <div className="mt-3">
                      <Link href={`/vehicles/${vehicle.id}`} passHref>
                        <Button {...{variant: "outline", size: "sm", className: "w-full"} as any}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* Specs comparison */}
            {specGroups.map((group) => (
              <React.Fragment key={group.title}>
                {/* Group header */}
                <tr>
                  <th 
                    colSpan={vehicles.length + 1} 
                    className="text-left p-4 bg-neutral-100 dark:bg-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-700"
                  >
                    <h3 className="font-medium text-neutral-700 dark:text-neutral-300">
                      {group.title}
                    </h3>
                  </th>
                </tr>
                
                {/* Spec rows */}
                {group.specs.map((spec) => (
                  <tr key={spec} className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-300 border-r border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 sticky left-0">
                      {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </th>
                    {vehicles.map((vehicle) => (
                      <td key={`${vehicle.id}-${spec}`} className="p-4 text-neutral-800 dark:text-neutral-200 text-center">
                        {formatSpec(spec, vehicle[spec as keyof VehicleForComparison])}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
            
            {/* Features comparison */}
            <tr>
              <th 
                colSpan={vehicles.length + 1} 
                className="text-left p-4 bg-neutral-100 dark:bg-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-700"
              >
                <h3 className="font-medium text-neutral-700 dark:text-neutral-300">
                  Features
                </h3>
              </th>
            </tr>
            
            {allFeatures.map((feature) => (
              <tr key={feature} className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-300 border-r border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 sticky left-0">
                  {feature}
                </th>
                {vehicles.map((vehicle) => (
                  <td key={`${vehicle.id}-${feature}`} className="p-4 text-center">
                    {hasFeature(vehicle, feature) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400 dark:text-neutral-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleComparison;
