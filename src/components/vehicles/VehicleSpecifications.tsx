import React from 'react';
import { Vehicle } from '@/components/vehicles/VehicleCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface VehicleSpecificationsProps {
  vehicle: Vehicle;
}

const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({ vehicle }) => {
  // Group specifications into logical sections
  const generalSpecs = [
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year },
    { label: 'Body Type', value: vehicle.bodyType || 'Not specified' },
    { label: 'Condition', value: vehicle.condition || 'Not specified' },
    { label: 'Doors', value: vehicle.doors || 'Not specified' },
    { label: 'Seats', value: vehicle.seats || 'Not specified' },
  ];

  const engineSpecs = [
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Engine Size', value: vehicle.engineSize || 'Not specified' },
    { 
      label: 'Engine Power', 
      value: vehicle.enginePower ? `${vehicle.enginePower} ${vehicle.enginePowerUnit || ''}` : 'Not specified'
    },
    { 
      label: 'Mileage', 
      value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} ${vehicle.mileageUnit}` : 'Not specified' 
    },
  ];

  const exteriorSpecs = [
    { label: 'Exterior Color', value: vehicle.exteriorColor || 'Not specified' },
    { label: 'Interior Color', value: vehicle.interiorColor || 'Not specified' },
  ];

  // Format currency for display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format specs in a structured way
  const renderSpecList = (specs: { label: string; value: string | number }[]) => (
    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2">
      {specs.map((spec, index) => (
        <div key={index} className="flex flex-col">
          <span className="text-sm text-neutral-500">{spec.label}</span>
          <span className="font-medium">{spec.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {/* Price and Location */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-primary-600">
                  {formatCurrency(vehicle.price, vehicle.currency)}
                </h3>
                {vehicle.isAuction && (
                  <p className="text-sm text-neutral-600">
                    Current Auction Price
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{vehicle.location}</span>
              </div>
            </div>

            {/* Auction Info (if applicable) */}
            {vehicle.isAuction && vehicle.auctionEndsAt && (
              <div className="rounded-md bg-secondary-50 p-4">
                <h4 className="mb-2 font-semibold">Live Auction</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Ends:</p>
                    <p className="font-medium">{new Date(vehicle.auctionEndsAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <button className="rounded-md bg-secondary-600 px-4 py-2 font-medium text-white hover:bg-secondary-700">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Specs */}
            <div className="grid grid-cols-4 gap-4 rounded-md bg-neutral-50 p-4">
              <div className="text-center">
                <div className="text-sm text-neutral-500">Year</div>
                <div className="font-medium">{vehicle.year}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500">Mileage</div>
                <div className="font-medium">{vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500">Fuel</div>
                <div className="font-medium">{vehicle.fuelType}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-neutral-500">Transmission</div>
                <div className="font-medium">{vehicle.transmission}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* General Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>General Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          {renderSpecList(generalSpecs)}
        </CardContent>
      </Card>
      
      {/* Engine & Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Engine & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {renderSpecList(engineSpecs)}
        </CardContent>
      </Card>
      
      {/* Exterior & Interior */}
      <Card>
        <CardHeader>
          <CardTitle>Exterior & Interior</CardTitle>
        </CardHeader>
        <CardContent>
          {renderSpecList(exteriorSpecs)}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleSpecifications;
