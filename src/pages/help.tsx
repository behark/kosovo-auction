import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Ndihmë - Kosovo Auction</title>
        <meta name="description" content="Gjeni përgjigjet për pyetjet tuaja" />
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Qendra e Ndihmës</h2>
          <p className="text-xl text-gray-600">Gjeni përgjigjet për pyetjet tuaja</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Pyetje të Shpeshta</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Si mund të regjistrohem?</h4>
                <p className="text-gray-600">Klikoni në butonin "Regjistrohu" dhe plotësoni formularin me të dhënat tuaja.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">A është e sigurt të bëj blerje?</h4>
                <p className="text-gray-600">Po, të gjitha transaksionet janë të mbrojtura dhe të sigurta.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Si funksionon ankandi?</h4>
                <p className="text-gray-600">Bëni ofertën tuaj dhe nëse jeni ofertuesi më i lartë, ju fitoni automjetin.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">A mund të anuloj ofertën?</h4>
                <p className="text-gray-600">Ofertat janë të detyrueshme, por mund të kontaktoni mbështetjen për raste të veçanta.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontaktoni Mbështetjen</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <span className="text-2xl mr-4">📞</span>
                <div>
                  <h4 className="text-lg font-semibold">Telefoni</h4>
                  <p className="text-gray-600">+383 45 123 456</p>
                  <p className="text-sm text-gray-500">E hënë - E premte: 08:00 - 20:00</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-2xl mr-4">📧</span>
                <div>
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p className="text-gray-600">info@kosovoauction.com</p>
                  <p className="text-sm text-gray-500">Përgjigje brenda 24 orësh</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-2xl mr-4">💬</span>
                <div>
                  <h4 className="text-lg font-semibold">Chat i Drejtpërdrejtë</h4>
                  <p className="text-gray-600">Disponueshëm 24/7</p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Fillo Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Kthehu në Ballina
          </Link>
        </div>
      </main>
    </div>
  );
}
