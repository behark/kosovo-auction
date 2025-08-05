import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Politika e Privatësisë - Kosovo Auction</title>
        <meta name="description" content="Politika e privatësisë për Kosovo Auction" />
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
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Politika e Privatësisë</h2>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">1. Mbledhja e të Dhënave</h3>
            <p className="mb-6 text-gray-700">
              Ne mbledhim të dhëna personale që na jepni vullnetarisht kur regjistroheni në platformën tonë.
            </p>

            <h3 className="text-xl font-semibold mb-4">2. Përdorimi i të Dhënave</h3>
            <p className="mb-6 text-gray-700">
              Të dhënat tuaja përdoren për të mundësuar shërbimin, për komunikim dhe për përmirësim të platformës.
            </p>

            <h3 className="text-xl font-semibold mb-4">3. Ndarja e të Dhënave</h3>
            <p className="mb-6 text-gray-700">
              Ne nuk i ndajmë të dhënat tuaja personale me palë të treta pa lejen tuaj, përveç rasteve të kërkuara nga ligji.
            </p>

            <h3 className="text-xl font-semibold mb-4">4. Siguria</h3>
            <p className="mb-6 text-gray-700">
              Aplikojmë masa të përshtatshme teknike dhe organizative për të mbrojtur të dhënat tuaja.
            </p>

            <h3 className="text-xl font-semibold mb-4">5. Të Drejtat Tuaja</h3>
            <p className="mb-6 text-gray-700">
              Ju keni të drejtë të aksesoni, ndryshoni ose fshini të dhënat tuaja personale në çdo kohë.
            </p>

            <h3 className="text-xl font-semibold mb-4">6. Kontakti</h3>
            <p className="mb-6 text-gray-700">
              Për çdo pyetje mbi privatësinë, mund të na kontaktoni në info@kosovoauction.com
            </p>
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Kthehu në Ballina
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
