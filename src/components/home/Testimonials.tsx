import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "BidVista has transformed how we source vehicles for our dealership. The platform's ease of use and the quality of vehicles available has made it an essential part of our business strategy.",
    author: "Alexander Müller",
    role: "Managing Director",
    company: "AutoPremium GmbH",
    avatar: "/images/testimonials/person-1.jpg",
    rating: 5
  },
  {
    id: 2,
    quote: "Since joining BidVista, we've increased our inventory turnover by 35%. The international reach and seamless logistics support have opened new markets we couldn't access before.",
    author: "Sophie Laurent",
    role: "Operations Manager",
    company: "EuroCars Group",
    avatar: "/images/testimonials/person-2.jpg",
    rating: 5
  },
  {
    id: 3,
    quote: "The detailed vehicle information and inspection reports give us confidence when bidding on vehicles from across Europe. BidVista's customer service team is also incredibly responsive.",
    author: "Marco Rossi",
    role: "Purchasing Director",
    company: "Italian Motor Partners",
    avatar: "/images/testimonials/person-3.jpg",
    rating: 4
  },
  {
    id: 4,
    quote: "As a smaller dealership, BidVista has leveled the playing field by giving us access to a wide range of quality vehicles that were previously difficult to source.",
    author: "Elisa Janssen",
    role: "Owner",
    company: "Prestige Auto Selection",
    avatar: "/images/testimonials/person-4.jpg",
    rating: 5
  },
  {
    id: 5,
    quote: "The transparency of the auction process and the comprehensive vehicle documentation have significantly reduced our risk when purchasing internationally.",
    author: "Dimitri Petrov",
    role: "CEO",
    company: "Eastern European Autos Ltd",
    avatar: "/images/testimonials/person-5.jpg",
    rating: 4
  }
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle automatic rotation
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
      }, 6000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  // Navigate to specific testimonial
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
    // Reset the timer when manually navigating
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length);
      }, 6000);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index}
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-neutral-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">What Our Dealers Say</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Hear from professionals who rely on BidVista for their vehicle sourcing needs
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 p-4"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-2 mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <blockquote className="text-lg text-neutral-700 italic flex-grow mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{testimonial.author}</div>
                        <div className="text-sm text-neutral-500">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => goToTestimonial((activeIndex - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-900 rounded-full p-2 shadow-md transition-all -ml-2 z-10"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => goToTestimonial((activeIndex + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-900 rounded-full p-2 shadow-md transition-all -mr-2 z-10"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'bg-primary-600 w-6' : 'bg-neutral-300 w-2.5 hover:bg-neutral-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {['Secure Transactions', 'Verified Dealers', '24/7 Support', 'Global Shipping', 'Quality Guarantee', 'Trusted Platform'].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary-100/60 p-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
