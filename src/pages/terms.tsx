import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Kushtet e Shërbimit - Kosovo Auction</title>
        <meta name="description" content="Kushtet e shërbimit për Kosovo Auction" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Kushtet e Shërbimit</h2>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">1. Përshkrimi i Shërbimit</h3>
            <p className="mb-6 text-gray-700">
              Kosovo Auction është një platformë online që lejon përdoruesit të blejnë dhe shesin automjete përmes sistemit të ankandit.
            </p>

            <h3 className="text-xl font-semibold mb-4">2. Regjistrimi dhe Llogaria</h3>
            <p className="mb-6 text-gray-700">
              Për të përdorur shërbimin, duhet të krijoni një llogari dhe të jepni informacione të sakta dhe të plota.
            </p>

            <h3 className="text-xl font-semibold mb-4">3. Ofertat dhe Blerjet</h3>
            <p className="mb-6 text-gray-700">
              Të gjitha ofertat janë të detyrueshme. Nëse fitoni një ankand, jeni të detyruar të përfundoni blerjen.
            </p>

            <h3 className="text-xl font-semibold mb-4">4. Siguria dhe Privatësia</h3>
            <p className="mb-6 text-gray-700">
              Ne mbrojmë të dhënat tuaja dhe sigurojmë transaksione të sigurta në platformën tonë.
            </p>

            <h3 className="text-xl font-semibold mb-4">5. Përgjegjësitë</h3>
            <p className="mb-6 text-gray-700">
              Përdoruesit janë përgjegjës për të gjitha aktivitetet në llogarinë e tyre dhe për saktësinë e informacioneve.
            </p>

            <h3 className="text-xl font-semibold mb-4">6. Ndryshimet</h3>
            <p className="mb-6 text-gray-700">
              Ne rezervojmë të drejtën për të ndryshuar këto kushte në çdo kohë. Ndryshimet do të publikohen në këtë faqe.
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
