import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Pyetje të Shpeshta - Kosovo Auction</title>
        <meta name="description" content="Pyetje të shpeshta për Kosovo Auction" />
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pyetje të Shpeshta</h2>
          <p className="text-xl text-gray-600">Gjeni përgjigjet për pyetjet më të shpeshta</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">🚗 Si mund të gjej automjetin që kërkoj?</h3>
            <p className="text-gray-700">
              Përdorni filtrat në faqen e automjeteve për të kërkuar sipas markës, modelit, çmimit, vitit dhe karakteristikave të tjera.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">💰 Si funksionon sistemi i ofertave?</h3>
            <p className="text-gray-700">
              Bëni ofertën tuaj në ankand. Nëse jeni ofertuesi më i lartë kur përfundon ankandi, ju fitoni automjetin.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibild mb-3">🔍 A kontrollohen automjetet para shitjes?</h3>
            <p className="text-gray-700">
              Po, të gjitha automjetet kontrollohen nga ekspertët tanë dhe vijnë me raport të detajuar të gjendjes.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">💳 Cilat janë metodat e pagesës?</h3>
            <p className="text-gray-700">
              Pranojmë pagesa me karta krediti/debiti, transfer bankar dhe pagesa në para të gatshme.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">📋 A mund të regjistrojem automjetin tim për shitje?</h3>
            <p className="text-gray-700">
              Po, mund të regjistroni automjetin tuaj falas. Ne do ta kontrollojmë dhe do ta vendosim në ankand.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">🚚 Si funksionon dërgesa e automjetit?</h3>
            <p className="text-gray-700">
              Ofrojmë shërbim transporti në të gjithë Kosovën ose mund ta merrni automjetin vetë nga qendra jonë.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">📞 Si mund të kontaktoj mbështetjen?</h3>
            <p className="text-gray-700">
              Mund të na kontaktoni në +383 45 123 456, info@kosovoauction.com ose përmes chat-it të drejtpërdrejtë.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3">🔒 A janë të sigurta transaksionet?</h3>
            <p className="text-gray-700">
              Po, të gjitha transaksionet janë të enkriptuara dhe të mbrojtura. Paranë e paguani vetëm pasi të konfirmoni automjetin.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/help" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition mr-4">
            Më Shumë Ndihmë
          </Link>
          <Link href="/" className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition">
            Kthehu në Ballina
          </Link>
        </div>
      </main>
    </div>
  );
}
