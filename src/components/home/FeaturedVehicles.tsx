import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import VehicleCard, { Vehicle } from '@/components/vehicles/VehicleCard';

// Mock data for featured vehicles - in production this would come from an API
const mockFeaturedVehicles: Vehicle[] = [
  {
    id: 'v1',
    title: 'Mercedes-Benz S-Class AMG Line',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2023,
    mileage: 5000,
    mileageUnit: 'km',
    fuelType: 'Hybrid',
    transmission: 'automatic',
    price: 89500,
    currency: 'EUR',
    images: ['/images/vehicles/mercedes-s-class.jpg'],
    location: 'Berlin, Germany',
    isAuction: true,
    auctionEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    featuredUntil: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    condition: 'New',
    exteriorColor: 'Obsidian Black',
    interiorColor: 'Macchiato Beige/Magma Grey',
    engineSize: '3.0L',
    enginePower: '435',
    enginePowerUnit: 'hp',
    bodyType: 'Sedan',
    doors: 4,
    seats: 5
  },
  {
    id: 'v2',
    title: 'BMW X5 M Competition',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    mileage: 12000,
    mileageUnit: 'km',
    fuelType: 'Petrol',
    transmission: 'automatic',
    price: 105000,
    currency: 'EUR',
    images: ['/images/vehicles/bmw-x5.jpg'],
    location: 'Milan, Italy',
    isAuction: false,
    featuredUntil: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    condition: 'Used',
    exteriorColor: 'Alpine White',
    interiorColor: 'Black',
    engineSize: '4.4L',
    enginePower: '625',
    enginePowerUnit: 'hp',
    bodyType: 'SUV',
    doors: 5,
    seats: 5
  },
  {
    id: 'v3',
    title: 'Audi e-tron GT',
    make: 'Audi',
    model: 'e-tron GT',
    year: 2023,
    mileage: 1500,
    mileageUnit: 'km',
    fuelType: 'Electric',
    transmission: 'automatic',
    price: 120000,
    currency: 'EUR',
    images: ['/images/vehicles/audi-etron.jpg'],
    location: 'Vienna, Austria',
    isAuction: true,
    auctionEndsAt: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    featuredUntil: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
    condition: 'New',
    exteriorColor: 'Tactical Green',
    interiorColor: 'Black/Red',
    enginePower: '637',
    enginePowerUnit: 'hp',
    bodyType: 'Sedan',
    doors: 4,
    seats: 4
  },
  {
    id: 'v4',
    title: 'Porsche 911 Carrera 4S',
    make: 'Porsche',
    model: '911',
    year: 2022,
    mileage: 8500,
    mileageUnit: 'km',
    fuelType: 'Petrol',
    transmission: 'automatic',
    price: 145000,
    currency: 'EUR',
    images: ['/images/vehicles/porsche-911.jpg'],
    location: 'Zurich, Switzerland',
    isAuction: false,
    featuredUntil: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
    condition: 'Used',
    exteriorColor: 'GT Silver',
    interiorColor: 'Black',
    engineSize: '3.0L',
    enginePower: '443',
    enginePowerUnit: 'hp',
    bodyType: 'Coupe',
    doors: 2,
    seats: 4
  },
  {
    id: 'v5',
    title: 'Range Rover Sport P530',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2023,
    mileage: 3000,
    mileageUnit: 'km',
    fuelType: 'Petrol',
    transmission: 'automatic',
    price: 125000,
    currency: 'EUR',
    images: ['/images/vehicles/range-rover-sport.jpg'],
    location: 'Paris, France',
    isAuction: true,
    auctionEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    featuredUntil: new Date(Date.now() + 86400000 * 8).toISOString(), // 8 days from now
    condition: 'New',
    exteriorColor: 'Santorini Black',
    interiorColor: 'Ebony',
    engineSize: '4.4L',
    enginePower: '523',
    enginePowerUnit: 'hp',
    bodyType: 'SUV',
    doors: 5,
    seats: 5
  },
  {
    id: 'v6',
    title: 'Tesla Model S Plaid',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    mileage: 500,
    mileageUnit: 'km',
    fuelType: 'Electric',
    transmission: 'automatic',
    price: 135000,
    currency: 'EUR',
    images: ['/images/vehicles/tesla-model-s.jpg'],
    location: 'Amsterdam, Netherlands',
    isAuction: false,
    featuredUntil: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    condition: 'New',
    exteriorColor: 'Deep Blue Metallic',
    interiorColor: 'Cream',
    enginePower: '1020',
    enginePowerUnit: 'hp',
    bodyType: 'Sedan',
    doors: 4,
    seats: 5
  }
];

// Define arrow icons as components
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const FeaturedVehicles: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'auction' | 'new'>('featured');

  // Filter vehicles based on active tab
  const filteredVehicles = mockFeaturedVehicles.filter(vehicle => {
    if (activeTab === 'featured') return !!vehicle.featuredUntil;
    if (activeTab === 'auction') return vehicle.isAuction;
    if (activeTab === 'new') return vehicle.condition === 'New';
    return true;
  });

  // Check scroll possibility
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  // Scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Update scrollability when component mounts or window resizes
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  // Update scrollability when tab changes
  useEffect(() => {
    checkScrollability();
  }, [activeTab]);

  // Attach scroll event listener to check scrollability during scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollability);
      return () => scrollContainer.removeEventListener('scroll', checkScrollability);
    }
  }, []);

  return (
    <section className="bg-white py-16">
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Featured Vehicles</h2>
            <p className="mt-2 text-lg text-neutral-600">
              Explore our selection of premium vehicles available for auction and direct purchase
            </p>
          </div>
          <Link href="/vehicles">
            <Button variant="outline">
              View All Vehicles
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'featured'
                ? 'border-b-2 border-primary-500 text-primary-700'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('featured')}
          >
            Featured
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'auction'
                ? 'border-b-2 border-primary-500 text-primary-700'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('auction')}
          >
            Live Auctions
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'new'
                ? 'border-b-2 border-primary-500 text-primary-700'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('new')}
          >
            New Arrivals
          </button>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Controls */}
          <div className="absolute top-1/2 left-0 right-0 z-10 flex -translate-y-1/2 justify-between pointer-events-none">
            <button
              onClick={() => scroll('left')}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity pointer-events-auto ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 cursor-default'
              }`}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ArrowLeftIcon />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity pointer-events-auto ${
                canScrollRight ? 'opacity-100' : 'opacity-0 cursor-default'
              }`}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ArrowRightIcon />
            </button>
          </div>

          {/* Scrollable Vehicle Cards */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-4 pt-2 scrollbar-hide"
            onScroll={checkScrollability}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="w-full min-w-[300px] max-w-[350px] flex-shrink-0">
                  <VehicleCard 
                    vehicle={vehicle} 
                    variant={activeTab === 'featured' ? 'featured' : 'default'} 
                  />
                </div>
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-12 text-neutral-500">
                No vehicles found for this category.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedVehicles;
