import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { colors } from '@/styles/design-system';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-neutral-50 to-white pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary-300 blur-3xl" />
        <div className="absolute left-20 bottom-20 h-72 w-72 rounded-full bg-secondary-300 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Hero content */}
          <div className="text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <Logo size="xl" />
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              The Premier B2B <span className="text-primary-600">Vehicle Auction</span> Platform
            </h1>
            
            <p className="mb-8 text-lg text-neutral-700 md:text-xl">
              Connect with verified dealers worldwide, access exclusive inventory, and streamline your vehicle acquisition process with our comprehensive international auction platform.
            </p>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-start">
              <Link href="/auctions">
                <Button size="lg">
                  Explore Auctions
                </Button>
              </Link>
              <Link href="/auth/dealer-signup">
                <Button variant="outline" size="lg">
                  Join as Dealer
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-neutral-500 md:justify-start">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Verified Dealers Only</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Global Shipping</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Transactions</span>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg md:mx-0">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-lg bg-primary-100 -z-10"></div>
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-lg bg-secondary-100 -z-10"></div>
              
              {/* Main image with card-like styling */}
              <div className="overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="aspect-w-16 aspect-h-10 relative">
                  {/* Replace with an actual image in production */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
                    {/* Simulated content - replace with actual image */}
                    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-white">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">Watch How It Works</h3>
                      <p className="text-center text-sm">Click to see how BidVista transforms vehicle auctions for dealers</p>
                    </div>
                  </div>
                </div>
                
                {/* Statistics bar below the image */}
                <div className="grid grid-cols-3 divide-x divide-neutral-200 bg-white">
                  <div className="p-4 text-center">
                    <div className="text-xl font-bold text-primary-600">5,000+</div>
                    <div className="text-xs text-neutral-500">Vehicles Monthly</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-xl font-bold text-primary-600">50+</div>
                    <div className="text-xs text-neutral-500">Countries</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-xl font-bold text-primary-600">3,000+</div>
                    <div className="text-xs text-neutral-500">Verified Dealers</div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -right-6 top-1/3 flex h-12 items-center rounded-full bg-white px-4 shadow-md">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-success-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">98% Satisfaction Rate</span>
              </div>
              
              <div className="absolute -left-6 bottom-1/3 flex h-12 items-center rounded-full bg-white px-4 shadow-md">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Trusted by Top Dealers</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
