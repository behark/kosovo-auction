import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Language support
const translations = {
  sq: {
    title: 'Ankandi i Kosovës - Platforma më e madhe e ankandit të automjeteve',
    description: 'Zbuloni automjetet më të mira në Kosovë përmes ankandit online. Blerje të sigurta dhe të besueshme.',
    nav: {
      home: 'Ballina',
      auctions: 'Ankandet',
      about: 'Rreth Nesh',
      contact: 'Kontakti'
    },
    hero: {
      title: 'Platforma #1 e Ankandit të Automjeteve në Kosovë',
      subtitle: 'Gjeni automjetin tuaj të ëndrrave përmes ankandit online. Blerje të sigurta, çmime konkurruese, dhe shërbim profesional.',
      browseAuctions: 'Shiko Ankandet',
      sellVehicle: 'Shit Automjetin'
    },
    stats: {
      activeAuctions: 'Ankande Aktive',
      registeredUsers: 'Përdorues të Regjistruar',
      vehiclesSold: 'Automjete të Shitura',
      averageSavings: 'Kursim Mesatar'
    },
    featured: {
      title: 'Automjetet e Zgjedhura',
      subtitle: 'Automjetet më të kërkuara që janë aktualisht në ankand',
      liveAuction: 'Ankand i Drejtpërdrejtë',
      startingSoon: 'Fillon Së Shpejti',
      endingSoon: 'Përfundon Së Shpejti',
      timeLeft: 'Kohë e mbetur',
      location: 'Vendndodhja',
      mileage: 'Kilometrazha',
      currentBid: 'Oferta Aktuale',
      placeBid: 'Bëj Ofertë'
    },
    features: {
      title: 'Pse të Zgjedhësh Ankandin e Kosovës?',
      secure: {
        title: 'Transaksione të Sigurta',
        description: 'Sistemi ynë i enkriptuar siguron që të gjitha transaksionet tuaja janë të mbrojtura plotësisht.'
      },
      verified: {
        title: 'Automjete të Verifikuara',
        description: 'Çdo automjet kontrollohet nga ekspertët tanë para se të vendoset në ankand.'
      },
      support: {
        title: 'Mbështetje 24/7',
        description: 'Ekipi ynë është i disponueshëm 24 orë në ditë për t\'ju ndihmuar në çdo hap.'
      },
      competitive: {
        title: 'Çmime Konkurruese',
        description: 'Merrni automjetet më të mira me çmimet më konkurruese në treg.'
      }
    },
    cta: {
      title: 'Gati për të Filluar?',
      subtitle: 'Regjistrohuni sot dhe filloni të blini ose të shisni automjete përmes ankandit.',
      register: 'Regjistrohu Tani',
      learn: 'Mëso Më Shumë'
    },
    footer: {
      description: 'Platforma më e besueshme e ankandit të automjeteve në Kosovë.',
      quickLinks: 'Lidhje të Shpejta',
      services: 'Shërbimet',
      contact: 'Kontakti',
      rights: 'Të gjitha të drejtat e rezervuara.',
      address: 'Prishtinë, Kosovë',
      email: 'info@ankandiikosoves.com',
      phone: '+383 44 123 456'
    }
  },
  en: {
    title: 'Kosovo Auction - The Largest Vehicle Auction Platform',
    description: 'Discover the best vehicles in Kosovo through online auctions. Safe and reliable purchases.',
    nav: {
      home: 'Home',
      auctions: 'Auctions',
      about: 'About',
      contact: 'Contact'
    },
    hero: {
      title: 'Kosovo\'s #1 Vehicle Auction Platform',
      subtitle: 'Find your dream vehicle through online auctions. Safe purchases, competitive prices, and professional service.',
      browseAuctions: 'Browse Auctions',
      sellVehicle: 'Sell Vehicle'
    },
    stats: {
      activeAuctions: 'Active Auctions',
      registeredUsers: 'Registered Users',
      vehiclesSold: 'Vehicles Sold',
      averageSavings: 'Average Savings'
    },
    featured: {
      title: 'Featured Vehicles',
      subtitle: 'The most sought-after vehicles currently at auction',
      liveAuction: 'Live Auction',
      startingSoon: 'Starting Soon',
      endingSoon: 'Ending Soon',
      timeLeft: 'Time Left',
      location: 'Location',
      mileage: 'Mileage',
      currentBid: 'Current Bid',
      placeBid: 'Place Bid'
    },
    features: {
      title: 'Why Choose Kosovo Auction?',
      secure: {
        title: 'Secure Transactions',
        description: 'Our encrypted system ensures all your transactions are fully protected.'
      },
      verified: {
        title: 'Verified Vehicles',
        description: 'Every vehicle is inspected by our experts before being listed for auction.'
      },
      support: {
        title: '24/7 Support',
        description: 'Our team is available 24 hours a day to help you every step of the way.'
      },
      competitive: {
        title: 'Competitive Prices',
        description: 'Get the best vehicles at the most competitive prices in the market.'
      }
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Register today and start buying or selling vehicles through auctions.',
      register: 'Register Now',
      learn: 'Learn More'
    },
    footer: {
      description: 'The most trusted vehicle auction platform in Kosovo.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contact: 'Contact',
      rights: 'All rights reserved.',
      address: 'Pristina, Kosovo',
      email: 'info@kosovoauction.com',
      phone: '+383 44 123 456'
    }
  }
};

// Mock data for featured vehicles
const featuredVehicles = [
  {
    id: 1,
    make: 'BMW',
    model: 'X5',
    year: 2021,
    price: 45000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
    location: 'Prishtina',
    mileage: 35000,
    status: 'Live Auction',
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  },
  {
    id: 2,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    price: 38000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop',
    location: 'Prizren',
    mileage: 42000,
    status: 'Starting Soon',
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
  },
  {
    id: 3,
    make: 'Audi',
    model: 'A4',
    year: 2022,
    price: 42000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop',
    location: 'Peja',
    mileage: 28000,
    status: 'Live Auction',
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
  }
];

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<{[key: number]: string}>({});
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');
  const [location, setLocation] = useState<'kosovo' | 'albania' | 'macedonia'>('kosovo');
  
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sq' ? 'en' : 'sq');
  };

  const handleLocationChange = (newLocation: 'kosovo' | 'albania' | 'macedonia') => {
    setLocation(newLocation);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: {[key: number]: string} = {};
      
      featuredVehicles.forEach(vehicle => {
        const difference = vehicle.endTime.getTime() - new Date().getTime();
        
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[vehicle.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[vehicle.id] = 'Auction Ended';
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-blue-600">
                  {location === 'kosovo' ? 'Ankandi i Kosovës' : 
                   location === 'albania' ? 'Ankandi i Shqipërisë' : 
                   'Ankandi i Maqedonisë'}
                </h1>
              </div>
            </div>
            
            {/* Language and Location Controls */}
            <div className="flex items-center space-x-4">
              {/* Location Selector */}
              <div className="relative">
                <select 
                  value={location} 
                  onChange={(e) => handleLocationChange(e.target.value as 'kosovo' | 'albania' | 'macedonia')}
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="kosovo">🇽🇰 Kosovë</option>
                  <option value="albania">🇦🇱 Shqipëri</option>
                  <option value="macedonia">🇲🇰 Maqedoni</option>
                </select>
              </div>
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                <span>{language === 'sq' ? '🇬🇧 EN' : '🇦🇱 SQ'}</span>
              </button>
            </div>
            
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  {t.nav.home}
                </Link>
                <Link href="/vehicles" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  {t.nav.auctions}
                </Link>
                <Link href="/auctions" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    {t.nav.auctions}
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  {t.nav.about}
                </Link>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  {t.cta.register}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                {t.hero.title}
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition">
                  {t.hero.browseAuctions}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                  {t.cta.learn}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
                <div className="text-gray-600">{t.stats.vehiclesSold}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">850+</div>
                <div className="text-gray-600">{t.stats.registeredUsers}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Shkallë Kënaqësie</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Mbështetje Disponueshme</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Auctions */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.featured.title}</h3>
              <p className="text-lg text-gray-600">{t.featured.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="relative">
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.status === 'Live Auction' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {vehicle.status}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h4>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        €{vehicle.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500">
                        {vehicle.mileage.toLocaleString()} km
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">📍 {vehicle.location}</span>
                      <span className="text-sm font-medium text-red-600">
                        {timeLeft[vehicle.id] || 'Loading...'}
                      </span>
                    </div>
                    
                    <Link href={`/vehicles/${vehicle.id}`}>
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        View Details & Bid
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/auctions">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                  View All Auctions
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose KosovoAuction?</h3>
              <p className="text-lg text-gray-600">Trusted by dealers and buyers across Kosovo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Detailed Inspections</h4>
                <p className="text-gray-600">Every vehicle undergoes comprehensive inspection</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Secure Transactions</h4>
                <p className="text-gray-600">Protected payments and verified dealers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Real-time Bidding</h4>
                <p className="text-gray-600">Live auction platform with instant updates</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">24/7 Support</h4>
                <p className="text-gray-600">Dedicated support team always available</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h3>
            <p className="text-xl mb-8">Join thousands of satisfied customers on Kosovo's most trusted auction platform</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
                Register as Buyer
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Register as Seller
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">KosovoAuction</h4>
              <p className="text-gray-400">Kosovo's premier vehicle auction platform connecting buyers and sellers.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/vehicles" className="hover:text-white">Browse Vehicles</Link></li>
                <li><Link href="/auctions" className="hover:text-white">Live Auctions</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@kosovoauction.com</p>
                <p>📞 +383 45 123 456</p>
                <p>📍 Prishtina, Kosovo</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 KosovoAuction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
