import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  location: string;
  mileage: number;
  status: string;
  endTime: Date;
  category: string;
  fuelType: string;
  transmission: string;
  description: string;
}

const allVehicles: Vehicle[] = [
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
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    category: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    description: 'BMW X5 në gjendje të shkëlqyer, me të gjitha opsionet.'
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
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'Sedan',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    description: 'Mercedes C-Class me teknologji të avancuar.'
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
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    category: 'Sedan',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    description: 'Audi A4 model i ri me performancë të lartë.'
  },
  {
    id: 4,
    make: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    price: 25000,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=300&fit=crop',
    location: 'Gjakova',
    mileage: 15000,
    status: 'Live Auction',
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    category: 'Hatchback',
    fuelType: 'Diesel',
    transmission: 'Manual',
    description: 'Volkswagen Golf i ri, ekonomik dhe i besueshëm.'
  },
  {
    id: 5,
    make: 'Toyota',
    model: 'RAV4',
    year: 2020,
    price: 32000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop',
    location: 'Ferizaj',
    mileage: 38000,
    status: 'Starting Soon',
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    category: 'SUV',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    description: 'Toyota RAV4 Hybrid me konsum të ulët karburanti.'
  },
  {
    id: 6,
    make: 'Ford',
    model: 'Focus',
    year: 2019,
    price: 18000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
    location: 'Mitrovica',
    mileage: 55000,
    status: 'Auction Ended',
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Manual',
    description: 'Ford Focus në gjendje të mirë, ideal për qytet.'
  }
];

export default function Vehicles() {
  const [timeLeft, setTimeLeft] = useState<{[key: number]: string}>({});
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');
  const [location, setLocation] = useState<'kosovo' | 'albania' | 'macedonia'>('kosovo');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sq' ? 'en' : 'sq');
  };

  const handleLocationChange = (newLocation: 'kosovo' | 'albania' | 'macedonia') => {
    setLocation(newLocation);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: {[key: number]: string} = {};
      
      allVehicles.forEach(vehicle => {
        const difference = vehicle.endTime.getTime() - new Date().getTime();
        
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[vehicle.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[vehicle.id] = language === 'sq' ? 'Ankandi Përfundoi' : 'Auction Ended';
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [language]);

  // Filter vehicles based on search and filters
  const filteredVehicles = allVehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const translations = {
    sq: {
      title: 'Automjetet - Ankandi i Kosovës',
      subtitle: 'Gjeni automjetin tuaj të ëndrrave në ankandin tonë',
      search: 'Kërkoni automjete...',
      filter: 'Filtro',
      category: 'Kategoria',
      status: 'Statusi',
      all: 'Të gjitha',
      liveAuction: 'Ankand i Drejtpërdrejtë',
      startingSoon: 'Fillon Së Shpejti',
      auctionEnded: 'Ankandi Përfundoi',
      viewDetails: 'Shiko Detajet',
      placeBid: 'Bëj Ofertë',
      timeLeft: 'Kohë e mbetur',
      backToHome: 'Kthehu në Ballina'
    },
    en: {
      title: 'Vehicles - Kosovo Auction',
      subtitle: 'Find your dream vehicle in our auction',
      search: 'Search vehicles...',
      filter: 'Filter',
      category: 'Category',
      status: 'Status',
      all: 'All',
      liveAuction: 'Live Auction',
      startingSoon: 'Starting Soon',
      auctionEnded: 'Auction Ended',
      viewDetails: 'View Details',
      placeBid: 'Place Bid',
      timeLeft: 'Time Left',
      backToHome: 'Back to Home'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.subtitle} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-3xl font-bold text-blue-600 cursor-pointer">
                  {location === 'kosovo' ? 'Ankandi i Kosovës' : 
                   location === 'albania' ? 'Ankandi i Shqipërisë' : 
                   'Ankandi i Maqedonisë'}
                </h1>
              </Link>
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
          </div>
        </div>
      </header>

      {/* Navigation Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-blue-600">
                  {t.backToHome}
                </Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{t.title.split(' - ')[0]}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.title.split(' - ')[0]}</h2>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t.all} {t.category}</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t.all} {t.status}</option>
                <option value="Live Auction">{t.liveAuction}</option>
                <option value="Starting Soon">{t.startingSoon}</option>
                <option value="Auction Ended">{t.auctionEnded}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'sq' 
              ? `${filteredVehicles.length} automjete të gjetur`
              : `${filteredVehicles.length} vehicles found`
            }
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
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
                    : vehicle.status === 'Starting Soon'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-500 text-white'
                }`}>
                  {language === 'sq' 
                    ? (vehicle.status === 'Live Auction' ? 'Ankand i Drejtpërdrejtë' :
                       vehicle.status === 'Starting Soon' ? 'Fillon Së Shpejti' :
                       'Ankandi Përfundoi')
                    : vehicle.status
                  }
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                
                <p className="text-gray-600 mb-3 text-sm">{vehicle.description}</p>
                
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
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{vehicle.fuelType}</span>
                  <span className="text-sm text-gray-500">{vehicle.transmission}</span>
                </div>
                
                <Link href={`/vehicles/${vehicle.id}`}>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    {vehicle.status === 'Auction Ended' ? t.viewDetails : t.placeBid}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'sq' 
                ? 'Nuk u gjetën automjete që përputhen me kriteret tuaja.'
                : 'No vehicles found matching your criteria.'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
