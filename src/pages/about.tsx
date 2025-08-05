import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');
  const [location, setLocation] = useState<'kosovo' | 'albania' | 'macedonia'>('kosovo');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sq' ? 'en' : 'sq');
  };

  const handleLocationChange = (newLocation: 'kosovo' | 'albania' | 'macedonia') => {
    setLocation(newLocation);
  };

  const translations = {
    sq: {
      title: 'Rreth Nesh - Ankandi i Kosovës',
      description: 'Mësoni më shumë rreth platformës më të besueshme të ankandit të automjeteve në Kosovë.',
      heading: 'Rreth Ankandit të Kosovës',
      intro: 'Ne jemi platforma më e madhe dhe më e besueshme e ankandit të automjeteve në Kosovë, që lidh blerësit dhe shitësit në një mjedis të sigurt dhe transparent.',
      ourMission: 'Misioni Ynë',
      missionText: 'Misioni ynë është të krijojmë një platformë të besueshme dhe të sigurt ku çdo person mund të blejë ose të shesë automjete përmes ankandit online. Ne ofrojmë shërbim profesional, transparencë të plotë dhe mbështetje 24/7.',
      ourValues: 'Vlerat Tona',
      values: {
        trust: {
          title: 'Besueshmëria',
          description: 'Secili automjet verifikohet nga ekspertët tanë para se të vendoset në ankand.'
        },
        transparency: {
          title: 'Transparenca',
          description: 'Të gjitha informacionet janë të qarta dhe të sakta për çdo automjet.'
        },
        security: {
          title: 'Siguria',
          description: 'Transaksionet tuaja janë të mbrojtura me teknologjinë më të avancuar.'
        },
        support: {
          title: 'Mbështetja',
          description: 'Ekipi ynë është i disponueshëm 24/7 për t\'ju ndihmuar në çdo hap.'
        }
      },
      ourTeam: 'Ekipi Ynë',
      teamText: 'Ekipi ynë përbëhet nga ekspertë të fushës së automjeteve, teknologjisë dhe shërbimit ndaj klientëve. Ne punojmë bashkë për të ofruar përvojën më të mirë të mundshme për përdoruesit tanë.',
      whyChooseUs: 'Pse të na Zgjidhni?',
      benefits: [
        'Platforma më e madhe në Kosovë me mbi 2,500 automjete të shitura',
        'Verifikim i plotë i të gjitha automjeteve nga ekspertët tanë',
        'Ankande në kohë reale me transparencë të plotë',
        'Mbështetje profesionale 24/7 në gjuhën shqipe',
        'Transaksione të sigurta dhe të mbrojtura',
        'Aplikacion mobil për iOS dhe Android',
        'Sistemi më i avancuar i oferimit në rajon'
      ],
      ourHistory: 'Historia Jonë',
      historyText: 'E krijuar në vitin 2020, Ankandi i Kosovës është rritur shpejt për të bërë platformën kryesore të ankandit të automjeteve në Kosovë. Ne kemi ndërmjetësuar mijëra transaksione të suksesshme dhe kemi ndërtuar një komunitet të fortë të besimit.',
      contact: 'Kontaktoni Nesh',
      contactText: 'Jeni gati të filloni? Ose keni pyetje? Ekipi ynë është këtu për t\'ju ndihmuar.'
    },
    en: {
      title: 'About Us - Kosovo Auction',
      description: 'Learn more about Kosovo\'s most trusted vehicle auction platform.',
      heading: 'About Kosovo Auction',
      intro: 'We are Kosovo\'s largest and most trusted vehicle auction platform, connecting buyers and sellers in a secure and transparent environment.',
      ourMission: 'Our Mission',
      missionText: 'Our mission is to create a reliable and secure platform where anyone can buy or sell vehicles through online auctions. We offer professional service, complete transparency, and 24/7 support.',
      ourValues: 'Our Values',
      values: {
        trust: {
          title: 'Trust',
          description: 'Every vehicle is verified by our experts before being listed for auction.'
        },
        transparency: {
          title: 'Transparency',
          description: 'All information is clear and accurate for every vehicle.'
        },
        security: {
          title: 'Security',
          description: 'Your transactions are protected with the most advanced technology.'
        },
        support: {
          title: 'Support',
          description: 'Our team is available 24/7 to help you every step of the way.'
        }
      },
      ourTeam: 'Our Team',
      teamText: 'Our team consists of experts in automotive, technology, and customer service. We work together to provide the best possible experience for our users.',
      whyChooseUs: 'Why Choose Us?',
      benefits: [
        'Kosovo\'s largest platform with over 2,500 vehicles sold',
        'Complete verification of all vehicles by our experts',
        'Real-time auctions with complete transparency',
        'Professional 24/7 support in Albanian',
        'Secure and protected transactions',
        'Mobile app for iOS and Android',
        'The most advanced bidding system in the region'
      ],
      ourHistory: 'Our History',
      historyText: 'Founded in 2020, Kosovo Auction has quickly grown to become Kosovo\'s leading vehicle auction platform. We have facilitated thousands of successful transactions and built a strong community of trust.',
      contact: 'Contact Us',
      contactText: 'Ready to get started? Or have questions? Our team is here to help you.'
    }
  };

  const t = translations[language];

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
                <span className="text-gray-900 font-medium">
                  {language === 'sq' ? 'Rreth Nesh' : 'About Us'}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.heading}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.intro}</p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.ourMission}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{t.missionText}</p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t.ourValues}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="text-lg font-semibold mb-3">{t.values.trust.title}</h4>
              <p className="text-gray-600">{t.values.trust.description}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="text-lg font-semibold mb-3">{t.values.transparency.title}</h4>
              <p className="text-gray-600">{t.values.transparency.description}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-lg font-semibold mb-3">{t.values.security.title}</h4>
              <p className="text-gray-600">{t.values.security.description}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h4 className="text-lg font-semibold mb-3">{t.values.support.title}</h4>
              <p className="text-gray-600">{t.values.support.description}</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-8 text-center">{t.whyChooseUs}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.ourTeam}</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{t.teamText}</p>
            
            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">{language === 'sq' ? 'Ekspertë Automjetesh' : 'Vehicle Experts'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">8+</div>
                <div className="text-gray-600">{language === 'sq' ? 'Zhvillues Teknologjie' : 'Tech Developers'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12+</div>
                <div className="text-gray-600">{language === 'sq' ? 'Ekspertë Shërbimi' : 'Customer Service'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.ourHistory}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{t.historyText}</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.contact}</h3>
            <p className="text-gray-600 text-lg mb-8">{t.contactText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicles">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                  {language === 'sq' ? 'Shiko Automjetet' : 'View Vehicles'}
                </button>
              </Link>
              <Link href="/contact">
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition">
                  {language === 'sq' ? 'Kontaktoni Nesh' : 'Contact Us'}
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {location === 'kosovo' ? 'Ankandi i Kosovës' : 
                 location === 'albania' ? 'Ankandi i Shqipërisë' : 
                 'Ankandi i Maqedonisë'}
              </h4>
              <p className="text-gray-400">
                {language === 'sq' 
                  ? 'Platforma më e besueshme e ankandit të automjeteve në Kosovë.'
                  : 'Kosovo\'s most trusted vehicle auction platform.'
                }
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'sq' ? 'Lidhje të Shpejta' : 'Quick Links'}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/vehicles" className="hover:text-white">{language === 'sq' ? 'Automjetet' : 'Vehicles'}</Link></li>
                <li><Link href="/auctions" className="hover:text-white">{language === 'sq' ? 'Ankandet' : 'Auctions'}</Link></li>
                <li><Link href="/about" className="hover:text-white">{language === 'sq' ? 'Rreth Nesh' : 'About Us'}</Link></li>
                <li><Link href="/contact" className="hover:text-white">{language === 'sq' ? 'Kontakti' : 'Contact'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'sq' ? 'Mbështetja' : 'Support'}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">{language === 'sq' ? 'Ndihmë' : 'Help Center'}</Link></li>
                <li><Link href="/terms" className="hover:text-white">{language === 'sq' ? 'Kushtet' : 'Terms of Service'}</Link></li>
                <li><Link href="/privacy" className="hover:text-white">{language === 'sq' ? 'Privatësia' : 'Privacy Policy'}</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'sq' ? 'Kontakti' : 'Contact'}
              </h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@kosovoauction.com</p>
                <p>📞 +383 45 123 456</p>
                <p>📍 Prishtina, Kosovo</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Kosovo Auction. {language === 'sq' ? 'Të gjitha të drejtat e rezervuara.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
