import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Si Funksionon - Kosovo Auction</title>
        <meta name="description" content="Mësoni si funksionon platforma e ankandit" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/">
              <h1 className="text-3xl font-bold text-blue-600 cursor-pointer">
                Ankandi i Kosovës
              </h1>
            </Link>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Ballina
                </Link>
                <Link href="/vehicles" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Automjetet
                </Link>
                <Link href="/auctions" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Ankandet
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Rreth Nesh
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Kontakti
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Si Funksionon</h2>
          <p className="text-xl text-gray-600">Procesi i thjeshtë për blerje dhe shitje</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">1️⃣</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Regjistrohuni</h3>
            <p className="text-gray-600">Krijoni një llogari falas dhe verifikoni identitetin tuaj për të filluar.</p>
          </div>

          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">2️⃣</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Shfletoni ose Listoni</h3>
            <p className="text-gray-600">Gjeni automjetin tuaj ideal ose listoni automjetin tuaj për shitje.</p>
          </div>

          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">3️⃣</span>
            </div>
            <h3 className="text-xl font-bold mb-4">Bëni Ofertë</h3>
            <p className="text-gray-600">Merrni pjesë në ankand dhe fitoni automjetin me çmimin më të mirë.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Pse të Zgjedhësh Ne?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">🔍 Verifikim i Detajuar</h4>
              <p className="text-gray-600 mb-4">Çdo automjet kontrollohet nga ekspertët tanë para se të vendoset në ankand.</p>
              
              <h4 className="text-lg font-semibold mb-3">🛡️ Transaksione të Sigurta</h4>
              <p className="text-gray-600 mb-4">Sistemi ynë i enkriptuar siguron që të gjitha transaksionet tuaja janë të mbrojtura.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-3">📞 Mbështetje 24/7</h4>
              <p className="text-gray-600 mb-4">Ekipi ynë është i disponueshëm 24 orë në ditë për t'ju ndihmuar.</p>
              
              <h4 className="text-lg font-semibold mb-3">💰 Çmime Konkurruese</h4>
              <p className="text-gray-600 mb-4">Merrni automjetet më të mira me çmimet më konkurruese në treg.</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Filloni Tani
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
