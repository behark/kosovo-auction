import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <Head>
        <title>BidVista | B2B Vehicle Auction Platform</title>
        <meta name="description" content="BidVista is a professional B2B vehicle auction platform for verified dealers" />
      </Head>

      <main className="max-w-4xl mx-auto text-center">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">BidVista</h1>
          <p className="text-xl text-gray-700 mb-8">Professional B2B Vehicle Auction Platform</p>
          
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Site Under Maintenance</h2>
            <p className="text-gray-600 mb-4">
              We're currently updating our platform to serve you better.
              Please check back soon for our improved auction experience.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-800 font-medium">
                The full version of BidVista includes:
              </p>
              <ul className="mt-2 text-left list-disc pl-6 text-gray-700">
                <li>Exclusive B2B vehicle auctions</li>
                <li>Verified dealer access</li>
                <li>Comprehensive vehicle inspection reports</li>
                <li>Real-time bidding platform</li>
                <li>Secure transaction processing</li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Verified Dealers</h3>
              <p className="text-gray-600">Access to our exclusive network of verified automotive professionals</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Quality Vehicles</h3>
              <p className="text-gray-600">Comprehensive inspection reports and detailed vehicle history</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Secure Bidding</h3>
              <p className="text-gray-600">Real-time auction platform with transparent pricing</p>
            </div>
          </div>
        </div>
        
        <footer className="border-t pt-6 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BidVista. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
