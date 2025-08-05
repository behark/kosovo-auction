import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  mileageUnit: string;
  fuelType: string;
  transmission: string;
  price: number;
  currency: string;
  images: string[];
  location: string;
  isAuction: boolean;
  auctionEndsAt: string;
  featuredUntil: string;
  condition: string;
  exteriorColor: string;
  interiorColor: string;
  engineSize: string;
  enginePower: string;
  enginePowerUnit: string;
  bodyType: string;
  doors: number;
  seats: number;
}

// This would normally come from an API call
// Mock data for a specific vehicle
const getMockVehicleData = (id: string): Vehicle => {
  return {
    id,
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
    images: [
      '/images/vehicles/mercedes-s-class.jpg',
      '/images/vehicles/mercedes-s-class-interior.jpg',
      '/images/vehicles/mercedes-s-class-rear.jpg',
      '/images/vehicles/mercedes-s-class-engine.jpg',
    ],
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
  };
};

// Similar vehicles mock data
const similarVehicles: Vehicle[] = [
  {
    id: 'v2',
    title: 'BMW 7 Series 745e',
    make: 'BMW',
    model: '7 Series',
    year: 2022,
    mileage: 15000,
    mileageUnit: 'km',
    fuelType: 'Hybrid',
    transmission: 'automatic',
    price: 92000,
    currency: 'EUR',
    images: ['/images/vehicles/bmw-7.jpg'],
    location: 'Munich, Germany',
    isAuction: false,
  },
  {
    id: 'v3',
    title: 'Audi A8 L 60 TFSI e quattro',
    make: 'Audi',
    model: 'A8',
    year: 2023,
    mileage: 8000,
    mileageUnit: 'km',
    fuelType: 'Hybrid',
    transmission: 'automatic',
    price: 96000,
    currency: 'EUR',
    images: ['/images/vehicles/audi-a8.jpg'],
    location: 'Frankfurt, Germany',
    isAuction: true,
    auctionEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
  }
];

interface VehicleDetailPageProps {
  vehicleId: string;
  vehicle: Vehicle;
}

const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ vehicleId, vehicle }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Animation for content entrance
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>{`${vehicle.year} ${vehicle.make} ${vehicle.model} | BidVista`}</title>
        <meta name="description" content={`${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.fuelType}, ${vehicle.transmission}, ${vehicle.mileage.toLocaleString()} ${vehicle.mileageUnit} - Available at BidVista`} />
      </Head>

      <Navigation />

      <main className="bg-neutral-50 pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-200 bg-white">
          <Container className="py-2">
            <nav className="flex text-sm text-neutral-500">
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/vehicles" className="hover:text-primary-600">
                Vehicles
              </Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
            </nav>
          </Container>
        </div>

        {/* Vehicle Header */}
        <Container className="mt-6 mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <button 
                onClick={handleBack}
                className="mb-3 flex items-center text-sm text-neutral-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                aria-label="Back to results"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to results
              </button>
              <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl lg:text-4xl">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 text-lg text-neutral-700">{vehicle.title}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button {...{variant: "outline", size: "default"} as any} aria-label="Save this vehicle">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save
              </Button>
              <Button {...{variant: "outline", size: "default"} as any} aria-label="Share this vehicle">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </Button>
            </div>
          </div>
        </Container>

        {/* Main Content */}
        <Container>
          <div className={`transition-opacity duration-500 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column: Gallery and Specifications */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <VehicleGallery images={vehicle.images} title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
                </div>

                <div className="mb-8">
                  <VehicleSpecifications vehicle={vehicle} />
                </div>

                {/* Description Section */}
                <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
                  <h2 className="mb-4 text-xl font-semibold text-neutral-900">Description</h2>
                  <div className="prose prose-neutral max-w-none">
                    <p>
                      This exceptional {vehicle.year} {vehicle.make} {vehicle.model} represents the pinnacle of luxury and performance. With its powerful {vehicle.engineSize} engine delivering {vehicle.enginePower} {vehicle.enginePowerUnit} and sophisticated {vehicle.transmission} transmission, it offers an unrivaled driving experience.
                    </p>
                    <p>
                      The vehicle features a striking {vehicle.exteriorColor} exterior paired with a luxurious {vehicle.interiorColor} interior. With only {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit} on the odometer, this {vehicle.condition?.toLowerCase() || 'exceptional'} vehicle is in exceptional condition.
                    </p>
                    <p>
                      Standard features include adaptive cruise control, panoramic sunroof, premium sound system, 360-degree camera system, and advanced driver assistance systems. The vehicle includes a comprehensive warranty package and has undergone our rigorous inspection process.
                    </p>
                    <p>
                      Located in {vehicle.location}, this vehicle is available for immediate viewing by appointment. International shipping can be arranged to most destinations.
                    </p>
                  </div>
                </div>

                {/* Features Section */}
                <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
                  <h2 className="mb-4 text-xl font-semibold text-neutral-900">Features & Equipment</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Vehicle features">
                    {[
                      "Premium Package",
                      "Adaptive LED Headlights",
                      "Panoramic Sunroof",
                      "Leather Interior",
                      "Heated & Ventilated Seats",
                      "Power Trunk Lid",
                      "Head-Up Display",
                      "Burmester Sound System",
                      "Wireless Charging",
                      "Keyless Entry",
                      "Lane Assist",
                      "Park Assist",
                      "Adaptive Cruise Control",
                      "Night Vision Assistant",
                      "All-Wheel Drive",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center" role="listitem">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form and Similar Vehicles */}
              <div>
                {/* Contact Form */}
                <div className="mb-8 lg:sticky lg:top-24">
                  <VehicleContactForm 
                    vehicleId={vehicle.id} 
                    vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  />

                  {/* Quick Actions */}
                  <div className="mt-6 grid grid-cols-2 gap-4" role="group" aria-label="Quick contact options">
                    <a
                      href={`tel:+123456789`}
                      className="flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Dealer
                    </a>
                    <a
                      href={`https://wa.me/123456789?text=I'm%20interested%20in%20the%20${vehicle.year}%20${vehicle.make}%20${vehicle.model}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-[#25D366]" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Similar Vehicles */}
                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                  <h2 className="mb-4 text-xl font-semibold text-neutral-900" id="similar-vehicles">Similar Vehicles</h2>
                  <div className="space-y-4" role="list" aria-labelledby="similar-vehicles">
                    {similarVehicles.map((vehicle) => (
                      <Link 
                        key={vehicle.id}
                        href={`/vehicles/${vehicle.id}`}
                        className="flex gap-3 rounded-md border border-neutral-200 p-3 transition-all hover:border-primary-300 hover:bg-neutral-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        role="listitem"
                        aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      >
                        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-neutral-200">
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <div className="relative h-full w-full">
                              <img 
                                src={vehicle.images[0]} 
                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                                className="absolute h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium line-clamp-1">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                            <p className="text-sm text-neutral-600 line-clamp-1">{vehicle.mileage.toLocaleString()} {vehicle.mileageUnit} • {vehicle.fuelType}</p>
                          </div>
                          <div className="text-sm font-semibold text-primary-600">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: vehicle.currency,
                              maximumFractionDigits: 0,
                            }).format(vehicle.price)}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link href="/vehicles" className="mt-2 block text-center text-sm font-medium text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded">
                      View more similar vehicles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer CTA */}
      <div className="bg-primary-600 py-8 text-white">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="text-xl font-bold">Ready to find your perfect vehicle?</h3>
              <p className="mt-1 text-primary-100">
                Join thousands of dealers using BidVista to source quality vehicles.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/auctions">
                <Button {...{variant: "secondary", size: "lg"} as any}>
                  Browse Auctions
                </Button>
              </Link>
              <Link href="/auth/dealer-signup">
                <Button {...{variant: "white", size: "lg"} as any}>
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const vehicleId = context.params?.id as string;
  
  // In a real application, we would fetch the vehicle data from an API
  const vehicle = getMockVehicleData(vehicleId);
  
  return {
    props: {
      vehicleId,
      vehicle,
    },
  };
};

export default VehicleDetailPage;
