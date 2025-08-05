import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Auctions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Live Auctions - Kosovo Auction</title>
        <meta name="description" content="Live vehicle auctions in Kosovo" />
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
                <Link href="/auctions" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ankandet e Drejtpërdrejta</h2>
          <p className="text-xl text-gray-600">Merrni pjesë në ankandet tona të drejtpërdrejta</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">🚀 Së Shpejti!</h3>
          <p className="text-center text-gray-600 mb-8">
            Sistemi i ankandit të drejtpërdrejtë do të jetë në dispozicion së shpejti. 
            Regjistrohuni për të marrë njoftimet e para!
          </p>
          
          <div className="text-center">
            <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Kthehu në Ballina
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
