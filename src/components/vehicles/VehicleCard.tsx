import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Vehicle interface that matches what we expect from the backend
export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  mileageUnit: 'km' | 'mi';
  fuelType: string;
  transmission: 'automatic' | 'manual' | 'semi-automatic';
  price: number;
  currency: string;
  images: string[];
  location: string;
  isAuction: boolean;
  auctionEndsAt?: string;
  featuredUntil?: string;
  condition?: string;
  exteriorColor?: string;
  interiorColor?: string;
  engineSize?: string;
  enginePower?: string;
  enginePowerUnit?: 'hp' | 'kw';
  bodyType?: string;
  doors?: number;
  seats?: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  variant = 'default',
  className = '',
}) => {
  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format remaining time for auction
  const getRemainingTime = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const distance = end - now;
    
    if (distance < 0) return 'Ended';
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Determine card styling based on variant
  const getCardClasses = () => {
    switch (variant) {
      case 'compact':
        return 'h-full';
      case 'featured':
        return 'h-full border-2 border-primary-300';
      default:
        return 'h-full';
    }
  };

  // Determine image height based on variant
  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-40';
      case 'featured':
        return 'h-64';
      default:
        return 'h-52';
    }
  };

  return (
    <Card
      className={`${getCardClasses()} group overflow-hidden transition-all hover:shadow-md ${className}`}
      hover
      clickable
    >
      <Link href={`/vehicles/${vehicle.id}`} className="flex h-full flex-col">
        {/* Vehicle image */}
        <div className={`relative ${getImageHeight()} w-full overflow-hidden bg-neutral-200`}>
          {vehicle.images && vehicle.images.length > 0 ? (
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          )}

          {/* Featured badge */}
          {vehicle.featuredUntil && (
            <div className="absolute left-0 top-4 bg-primary-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              Featured
            </div>
          )}

          {/* Auction countdown or price */}
          <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-right text-white">
            {vehicle.isAuction && vehicle.auctionEndsAt ? (
              <div>
                <div className="text-xs opacity-90">Ends in</div>
                <div className="text-sm font-semibold">{getRemainingTime(vehicle.auctionEndsAt)}</div>
              </div>
            ) : (
              <div className="font-semibold">{formatPrice(vehicle.price, vehicle.currency)}</div>
            )}
          </div>
        </div>

        {/* Vehicle details */}
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>

          {/* Specifications grid */}
          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-neutral-600">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>{vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{vehicle.location}</span>
            </div>
          </div>

          {/* Bottom section with price or auction badge */}
          <div className="mt-auto flex items-center justify-between">
            {vehicle.isAuction ? (
              <div className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-800">
                Live Auction
              </div>
            ) : (
              <div className="text-xl font-semibold text-primary-600">
                {formatPrice(vehicle.price, vehicle.currency)}
              </div>
            )}

            {variant === 'featured' && (
              <Button size="sm" variant="ghost">
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default VehicleCard;
