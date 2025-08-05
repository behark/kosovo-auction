import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function VehicleDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');
  const [location, setLocation] = useState<'kosovo' | 'albania' | 'macedonia'>('kosovo');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showBidModal, setShowBidModal] = useState<boolean>(false);

  // Mock vehicle data
  const vehicle = {
    id: 1,
    make: 'BMW',
    model: 'X5',
    year: 2021,
    price: 45000,
    currentBid: 47500,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop'
    ],
    location: 'Prishtina',
    mileage: 35000,
    status: 'Live Auction',
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    fuelType: 'Diesel',
    transmission: 'Automatic',
    description: 'BMW X5 në gjendje të shkëlqyer, me të gjitha opsionet moderne. Automjet i mirëmbajtur rregullisht me historik të plotë servisi.',
    engineSize: '3.0L',
    enginePower: '265',
    color: 'Alpine White',
    doors: 5,
    seats: 7,
    features: [
      'Navigacion GPS',
      'Kamera e parkimit',
      'Ngrohje e ulëseve',
      'Sistem audio premium',
      'Kontroll klimatik automatik',
      'Xhama të errëta',
      'Rrotat prej aliazhi',
      'Sistemi i frenave ABS',
      'Airbags të plotë',
      'Bluetooth dhe USB'
    ]
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sq' ? 'en' : 'sq');
  };

  const handleLocationChange = (newLocation: 'kosovo' | 'albania' | 'macedonia') => {
    setLocation(newLocation);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = vehicle.endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft(language === 'sq' ? 'Ankandi Përfundoi' : 'Auction Ended');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [vehicle.endTime, language]);

  const translations = {
    sq: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} - Ankandi i Kosovës`,
      backToVehicles: 'Kthehu te Automjetet',
      currentBid: 'Oferta Aktuale',
      timeLeft: 'Kohë e mbetur',
      placeBid: 'Bëj Ofertë',
      watchlist: 'Shto në Lista',
      share: 'Ndaj',
      overview: 'Përmbledhje',
      specifications: 'Specifikimet',
      features: 'Karakteristikat',
      description: 'Përshkrimi',
      location: 'Vendndodhja',
      mileage: 'Kilometrazha',
      fuelType: 'Lloji i Karburantit',
      transmission: 'Transmisioni',
      color: 'Ngjyra',
      doors: 'Dyer',
      seats: 'Ulëse',
      engine: 'Motori',
      bidAmount: 'Shuma e Ofertës',
      minBid: 'Oferta minimale',
      submitBid: 'Dërgo Ofertën',
      cancel: 'Anulo',
      bidPlaced: 'Oferta u dërgua me sukses!'
    },
    en: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} - Kosovo Auction`,
      backToVehicles: 'Back to Vehicles',
      currentBid: 'Current Bid',
      timeLeft: 'Time Left',
      placeBid: 'Place Bid',
      watchlist: 'Add to Watchlist',
      share: 'Share',
      overview: 'Overview',
      specifications: 'Specifications',
      features: 'Features',
      description: 'Description',
      location: 'Location',
      mileage: 'Mileage',
      fuelType: 'Fuel Type',
      transmission: 'Transmission',
      color: 'Color',
      doors: 'Doors',
      seats: 'Seats',
      engine: 'Engine',
      bidAmount: 'Bid Amount',
      minBid: 'Minimum bid',
      submitBid: 'Submit Bid',
      cancel: 'Cancel',
      bidPlaced: 'Bid placed successfully!'
    }
  };

  const t = translations[language];

  const handleBidSubmit = () => {
    const amount = parseFloat(bidAmount);
    if (amount > vehicle.currentBid) {
      alert(t.bidPlaced);
      setShowBidModal(false);
      setBidAmount('');
    } else {
      alert(`${t.minBid}: €${(vehicle.currentBid + 100).toLocaleString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={vehicle.description} />
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

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-blue-600">
                  {language === 'sq' ? 'Ballina' : 'Home'}
                </Link>
              </li>
              <li><span className="text-gray-500">/</span></li>
              <li>
                <Link href="/vehicles" className="text-gray-500 hover:text-blue-600">
                  {language === 'sq' ? 'Automjetet' : 'Vehicles'}
                </Link>
              </li>
              <li><span className="text-gray-500">/</span></li>
              <li>
                <span className="text-gray-900 font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="relative">
                <img 
                  src={vehicle.images[selectedImage]} 
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">
                  {language === 'sq' ? 'Ankand i Drejtpërdrejtë' : 'Live Auction'}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{t.description}</h3>
              <p className="text-gray-600 mb-6">{vehicle.description}</p>
              
              {/* Key Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vehicle.mileage.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">km</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vehicle.year}</div>
                  <div className="text-sm text-gray-600">{language === 'sq' ? 'Viti' : 'Year'}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vehicle.fuelType}</div>
                  <div className="text-sm text-gray-600">{t.fuelType}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vehicle.transmission}</div>
                  <div className="text-sm text-gray-600">{t.transmission}</div>
                </div>
              </div>

              {/* Features */}
              <h4 className="text-lg font-semibold mb-4">{t.features}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Bidding Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  €{vehicle.currentBid.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{t.currentBid}</div>
              </div>

              <div className="text-center mb-6">
                <div className="text-xl font-semibold text-red-600 mb-2">{timeLeft}</div>
                <div className="text-sm text-gray-500">{t.timeLeft}</div>
              </div>

              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => setShowBidModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {t.placeBid}
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  {t.watchlist}
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  {t.share}
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">📍 {t.location}</span>
                  <span className="font-medium">{vehicle.location}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">🎨 {t.color}</span>
                  <span className="font-medium">{vehicle.color}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">🚗 {t.engine}</span>
                  <span className="font-medium">{vehicle.engineSize} - {vehicle.enginePower} HP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">{t.placeBid}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.bidAmount} (€)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={vehicle.currentBid + 100}
                placeholder={(vehicle.currentBid + 100).toString()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {t.minBid}: €{(vehicle.currentBid + 100).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBidSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {t.submitBid}
              </button>
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
