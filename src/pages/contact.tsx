import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');
  const [location, setLocation] = useState<'kosovo' | 'albania' | 'macedonia'>('kosovo');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sq' ? 'en' : 'sq');
  };

  const handleLocationChange = (newLocation: 'kosovo' | 'albania' | 'macedonia') => {
    setLocation(newLocation);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert(language === 'sq' ? 'Mesazhi u dërgua me sukses!' : 'Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const translations = {
    sq: {
      title: 'Kontakti - Ankandi i Kosovës',
      description: 'Kontaktoni ekipin tonë për çdo pyetje ose mbështetje që mund t\'ju nevojitet.',
      heading: 'Kontaktoni Nesh',
      subtitle: 'Jemi këtu për t\'ju ndihmuar! Kontaktoni nesh për çdo pyetje ose mbështetje.',
      getInTouch: 'Lidhuni me Ne',
      contactForm: 'Formulari i Kontaktit',
      name: 'Emri dhe Mbiemri',
      email: 'Email Adresa',
      phone: 'Numri i Telefonit',
      subject: 'Subjekti',
      message: 'Mesazhi',
      send: 'Dërgo Mesazhin',
      selectSubject: 'Zgjidhni subjektin',
      subjects: {
        general: 'Pyetje të Përgjithshme',
        buying: 'Blerje Automjetesh',
        selling: 'Shitje Automjetesh',
        technical: 'Mbështetje Teknike',
        account: 'Problemet me Llogarinë',
        other: 'Të tjera'
      },
      contactInfo: 'Informacionet e Kontaktit',
      office: 'Zyra Kryesore',
      hours: 'Oraret e Punës',
      workingHours: 'Hënë - Premte: 08:00 - 20:00\nShtunë: 09:00 - 17:00\nE Diel: Mbyllur',
      quickContact: 'Kontakt i Shpejtë',
      socialMedia: 'Mediat Sociale',
      followUs: 'Na ndiqni në mediat sociale për lajmet dhe ofertat e fundit',
      faq: 'Pyetjet e Shpeshta',
      faqText: 'Gjeni përgjigje të shpejta për pyetjet më të shpeshta',
      support: 'Mbështetje 24/7',
      supportText: 'Ekipi ynë është i disponueshëm 24 orë në ditë për t\'ju ndihmuar'
    },
    en: {
      title: 'Contact - Kosovo Auction',
      description: 'Contact our team for any questions or support you may need.',
      heading: 'Contact Us',
      subtitle: 'We\'re here to help! Contact us for any questions or support.',
      getInTouch: 'Get in Touch',
      contactForm: 'Contact Form',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      selectSubject: 'Select subject',
      subjects: {
        general: 'General Questions',
        buying: 'Buying Vehicles',
        selling: 'Selling Vehicles',
        technical: 'Technical Support',
        account: 'Account Issues',
        other: 'Other'
      },
      contactInfo: 'Contact Information',
      office: 'Main Office',
      hours: 'Working Hours',
      workingHours: 'Monday - Friday: 08:00 - 20:00\nSaturday: 09:00 - 17:00\nSunday: Closed',
      quickContact: 'Quick Contact',
      socialMedia: 'Social Media',
      followUs: 'Follow us on social media for latest news and offers',
      faq: 'FAQ',
      faqText: 'Find quick answers to frequently asked questions',
      support: '24/7 Support',
      supportText: 'Our team is available 24 hours a day to help you'
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
                  {language === 'sq' ? 'Kontakti' : 'Contact'}
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.contactForm}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.name} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.subject} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t.selectSubject}</option>
                      <option value="general">{t.subjects.general}</option>
                      <option value="buying">{t.subjects.buying}</option>
                      <option value="selling">{t.subjects.selling}</option>
                      <option value="technical">{t.subjects.technical}</option>
                      <option value="account">{t.subjects.account}</option>
                      <option value="other">{t.subjects.other}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.message} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                >
                  {t.send}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Contact Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t.contactInfo}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">🏢</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.office}</h4>
                      <p className="text-gray-600">Rr. Agim Ramadani, 10000</p>
                      <p className="text-gray-600">Prishtinë, Kosovë</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">📞</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.quickContact}</h4>
                      <p className="text-gray-600">+383 45 123 456</p>
                      <p className="text-gray-600">+383 44 123 456</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">📧</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@kosovoauction.com</p>
                      <p className="text-gray-600">support@kosovoauction.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">⏰</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.hours}</h4>
                      <p className="text-gray-600 whitespace-pre-line">{t.workingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'sq' ? 'Lidhje të Dobishme' : 'Useful Links'}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 text-xl">❓</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.faq}</h4>
                      <p className="text-gray-600 text-sm">{t.faqText}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 text-xl">🛠️</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.support}</h4>
                      <p className="text-gray-600 text-sm">{t.supportText}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 text-xl">📱</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.socialMedia}</h4>
                      <p className="text-gray-600 text-sm">{t.followUs}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">
                  {language === 'sq' ? 'Kontakt Urgjent' : 'Emergency Contact'}
                </h3>
                <p className="text-red-700 mb-3">
                  {language === 'sq' 
                    ? 'Për probleme urgjente jashtë orëve të punës:'
                    : 'For urgent issues outside working hours:'
                  }
                </p>
                <p className="text-red-800 font-semibold">📞 +383 44 999 888</p>
                <p className="text-red-600 text-sm mt-2">
                  {language === 'sq' 
                    ? 'Vetëm për emergjenca të vërteta'
                    : 'Only for genuine emergencies'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {language === 'sq' ? 'Gjeni Nesh' : 'Find Us'}
            </h3>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl text-gray-400">🗺️</span>
                <p className="text-gray-500 mt-2">
                  {language === 'sq' ? 'Harta do të shfaqet këtu' : 'Map will be displayed here'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Rr. Agim Ramadani, Prishtinë, Kosovë
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
