import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

// FAQ categories and questions
const faqData = [
  {
    id: 'buying',
    title: 'Buying Vehicles',
    questions: [
      {
        id: 'buying-1',
        question: 'How do I register as a dealer on BidVista?',
        answer: 'To register as a dealer, you need to click on the "Register as Dealer" button, fill out the application form with your business information, upload required documents for verification (business license, VAT number, etc.), and await approval from our verification team. The process typically takes 1-2 business days.'
      },
      {
        id: 'buying-2',
        question: 'What documents do I need to register?',
        answer: 'Required documents include: business registration certificate, VAT registration (if applicable), dealer license, photo ID of the company representative, and proof of business address (utility bill, lease agreement, etc.). Additional documents may be required depending on your location.'
      },
      {
        id: 'buying-3',
        question: 'How do I place bids in auctions?',
        answer: 'Once registered and logged in, browse available auctions, view vehicle details and inspection reports, and click "Place Bid" to enter your bid amount. You can set a maximum bid and enable auto-bidding. All bids are legally binding and subject to our terms and conditions.'
      },
      {
        id: 'buying-4',
        question: 'Can I inspect vehicles before bidding?',
        answer: 'Yes, BidVista provides detailed inspection reports for all vehicles. For physical inspections, you can schedule appointments through your account dashboard. Some locations also offer virtual inspections via video call with our inspection team.'
      },
      {
        id: 'buying-5',
        question: 'What fees are associated with purchasing?',
        answer: 'Purchasing fees include: buyer\'s premium (5-10% depending on vehicle value), platform fee (€150), document processing fee (varies by country), and optional services like transport, inspection, or customs handling. All applicable fees are clearly displayed before bidding.'
      },
    ]
  },
  {
    id: 'payment',
    title: 'Payment & Financing',
    questions: [
      {
        id: 'payment-1',
        question: 'What payment methods are accepted?',
        answer: 'We accept bank transfers (SEPA for EU), credit cards (Visa, Mastercard, American Express), and approved dealer financing. For international transactions, we also support wire transfers and select regional payment methods.'
      },
      {
        id: 'payment-2',
        question: 'Is financing available for purchases?',
        answer: 'Yes, BidVista partners with several financial institutions to offer dealer financing options. Registered dealers can apply for pre-approval through our financing portal. Terms and rates vary based on your business history and location.'
      },
      {
        id: 'payment-3',
        question: 'How are currency conversions handled?',
        answer: 'BidVista supports multiple currencies for browsing and bidding. The platform displays prices in your preferred currency, using real-time exchange rates. Final transactions are processed in the seller\'s currency or EUR, with transparent conversion rates shown at checkout.'
      },
      {
        id: 'payment-4',
        question: 'What is your refund policy?',
        answer: 'All sales are final once the auction closes and payment is processed. However, if a vehicle significantly differs from its description or inspection report, you may file a claim within 48 hours of receiving the vehicle. Each claim is evaluated individually by our dispute resolution team.'
      },
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping & Logistics',
    questions: [
      {
        id: 'shipping-1',
        question: 'How is vehicle shipping arranged?',
        answer: 'BidVista offers integrated shipping services through our logistics partners. After purchase, you can request shipping quotes directly through our platform. You can also arrange your own transportation if preferred.'
      },
      {
        id: 'shipping-2',
        question: 'What are the shipping costs?',
        answer: 'Shipping costs depend on vehicle size, distance, destination country, and selected service level. Our platform provides instant quotes from multiple logistics providers, allowing you to compare prices and services.'
      },
      {
        id: 'shipping-3',
        question: 'How long does shipping take?',
        answer: 'Domestic shipping typically takes 3-7 business days. International shipping within Europe ranges from 7-14 days. Shipping to other continents may take 14-45 days depending on the destination and shipping method (RoRo, container, air freight).'
      },
      {
        id: 'shipping-4',
        question: 'How do customs and import duties work?',
        answer: 'Import duties and taxes vary by country and are the responsibility of the buyer. Our customs specialists can provide guidance and documentation assistance. For an additional fee, we offer customs brokerage services to handle the entire import process.'
      },
      {
        id: 'shipping-5',
        question: 'Is vehicle tracking available during shipping?',
        answer: 'Yes, all shipments include real-time tracking through our platform. You will receive regular status updates and can view the current location and estimated delivery date of your vehicle at any time through your dashboard.'
      },
    ]
  },
  {
    id: 'account',
    title: 'Account Management',
    questions: [
      {
        id: 'account-1',
        question: 'How do I update my dealer information?',
        answer: 'You can update your dealer information through your account settings. Some changes may require verification and approval from our team. For major changes (company name, ownership, etc.), please contact our dealer support team.'
      },
      {
        id: 'account-2',
        question: 'Can I have multiple users on my dealer account?',
        answer: 'Yes, BidVista supports multi-user access with customizable permissions. The primary account holder can invite team members and assign specific roles (admin, bidder, viewer, finance) through the account management dashboard.'
      },
      {
        id: 'account-3',
        question: 'How do I view my purchase history?',
        answer: 'Your complete purchase history is available in your account dashboard under "Purchase History." You can filter by date, status, vehicle type, and export reports in various formats (PDF, CSV, Excel).'
      },
      {
        id: 'account-4',
        question: 'What happens if I forget my password?',
        answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and follow the instructions sent to your email to reset your password. For security reasons, password reset links expire after 24 hours.'
      },
    ]
  }
];

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('buying');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  const currentCategory = faqData.find(category => category.id === activeCategory);

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | BidVista</title>
        <meta name="description" content="Find answers to frequently asked questions about buying, selling, payments, shipping and more on BidVista's B2B vehicle auction platform." />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-primary-900 text-white py-12">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-white text-lg mb-8">
                Find answers to common questions about using BidVista's B2B vehicle auction platform
              </p>
              
              {/* Search Box */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search for answers..."
                  aria-label="Search FAQ questions"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-opacity-20"
                />
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <h2 className="font-semibold text-lg p-4 border-b border-neutral-200 bg-neutral-50">
                  FAQ Categories
                </h2>
                <nav className="flex flex-col">
                  {faqData.map((category) => (
                    <button
                      key={category.id}
                      className={`p-4 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        activeCategory === category.id 
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-700'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                      aria-pressed={activeCategory === category.id}
                      aria-controls={`${category.id}-questions`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.title}</span>
                        <span className="bg-neutral-200 text-neutral-800 rounded-full px-2 py-0.5 text-xs" aria-label={`${category.questions.length} questions`}>
                          {category.questions.length}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content - Questions */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                {currentCategory?.title}
              </h2>

              <div className="space-y-4" id={`${activeCategory}-questions`} role="region" aria-label={`${currentCategory?.title} questions and answers`}>
                {currentCategory?.questions.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-neutral-200 rounded-lg overflow-hidden bg-white"
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                      onClick={() => toggleQuestion(item.id)}
                      aria-expanded={expandedQuestions.includes(item.id)}
                      aria-controls={`answer-${item.id}`}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">
                        {item.question}
                      </h3>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-neutral-500 transition-transform ${
                          expandedQuestions.includes(item.id) ? 'transform rotate-180' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedQuestions.includes(item.id) && (
                      <div className="p-5 pt-0 border-t border-neutral-100" id={`answer-${item.id}`}>
                        <p className="text-neutral-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Still have questions */}
              <div className="mt-12 bg-primary-50 border border-primary-100 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-primary-900 mb-2">
                  Still have questions?
                </h3>
                <p className="text-primary-700 mb-6">
                  Our support team is here to help you with any other questions you might have
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/contact" aria-label="Contact our support team for assistance">
                    <Button
                      {...{
                        variant: "default",
                        size: "lg",
                        className: "focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:outline-none"
                      } as any}
                    >
                      Contact Support
                    </Button>
                  </Link>
                  <Button 
                    {...{
                      variant: "outline",
                      size: "lg",
                      className: "focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:outline-none"
                    } as any}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
        
        {/* Related Links */}
        <section className="bg-neutral-100 py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
              <p className="text-neutral-600 mb-4">
                Explore our detailed guides, tutorials and documentation
              </p>
              <Link href="/knowledge-base" className="text-primary-600 font-medium hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded-sm" aria-label="Browse knowledge base articles">
                Browse Articles →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
              <p className="text-neutral-600 mb-4">
                Watch step-by-step video guides on using BidVista features
              </p>
              <Link href="/tutorials" className="text-primary-600 font-medium hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded-sm" aria-label="Watch tutorial videos">
                Watch Videos →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Terms & Policies</h3>
              <p className="text-neutral-600 mb-4">
                Review our terms of service, privacy policy and other legal documents
              </p>
              <Link href="/legal" className="text-primary-600 font-medium hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded-sm" aria-label="View terms, policies and legal documents">
                View Documents →
              </Link>
            </div>
          </div>
        </Container>
      </section>
      </Layout>
    </>
  );
};

export default FAQPage;
