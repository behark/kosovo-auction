import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const AboutPage: React.FC = () => {
  const leadershipTeam = [
    {
      name: 'Martin Weber',
      role: 'Chief Executive Officer',
      bio: 'Former automotive executive with 20+ years experience in vehicle wholesale operations across Europe.',
      image: '/images/team/ceo.jpg',
    },
    {
      name: 'Sophia Chen',
      role: 'Chief Technology Officer',
      bio: 'Tech leader with background in marketplace platforms and auction systems for eBay and Sotheby\'s.',
      image: '/images/team/cto.jpg',
    },
    {
      name: 'Victor Novak',
      role: 'Chief Operations Officer',
      bio: 'Logistics expert with experience optimizing cross-border transport and customs processes.',
      image: '/images/team/coo.jpg',
    },
    {
      name: 'Elisa Müller',
      role: 'Chief Financial Officer',
      bio: 'Financial strategist with expertise in international payments and automotive financing.',
      image: '/images/team/cfo.jpg',
    },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'Founded in Frankfurt',
      description: 'BidVista was established with a vision to revolutionize cross-border vehicle trading for professional dealers.'
    },
    {
      year: '2020',
      title: 'Expansion to Eastern Europe',
      description: 'Successfully connected German dealers with emerging markets in Poland, Hungary, and Romania.'
    },
    {
      year: '2021',
      title: 'Logistics Network',
      description: 'Built proprietary logistics network with certified transport partners across 14 European countries.'
    },
    {
      year: '2022',
      title: 'Digital Transformation',
      description: 'Launched AI-powered condition reports and virtual inspections for remote bidding confidence.'
    },
    {
      year: '2023',
      title: 'B2B Growth',
      description: 'Reached 5,000 verified dealer partnerships with 100,000+ successful vehicle transactions.'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>About BidVista | Leading B2B Vehicle Auction Platform</title>
        <meta name="description" content="Learn about BidVista - the leading B2B vehicle auction platform connecting professional dealers across Europe with premium inventory and seamless logistics." />
      </Head>

      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Transforming Vehicle Auctions for Professionals
              </h1>
              <p className="text-white text-lg mb-8">
                BidVista is the premier B2B marketplace connecting verified dealers with premium inventory through a secure, efficient and transparent platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/dealer-signup" aria-label="Sign up as a dealer">
                  <Button
                    {...{
                      size: "lg",
                      className: "focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:outline-none"
                    } as any}
                  >
                    Join Our Network
                  </Button>
                </Link>
                <Link href="/contact" aria-label="Contact our team">
                  <Button
                    {...{
                      variant: "outline",
                      size: "lg",
                      className: "text-white border-white hover:bg-primary-800 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                    } as any}
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/about/team-photo.jpg"
                alt="BidVista leadership team during an international auto exhibition"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <p className="text-lg text-neutral-700 mb-6">
              Founded in 2019, BidVista emerged from a vision to transform how vehicle dealers across Europe connect and trade. We noticed a fragmented market where smaller dealers struggled to access premium inventory, while larger dealerships faced logistical challenges in cross-border expansion.
            </p>
            <p className="text-lg text-neutral-700 mb-6">
              Our founders brought together expertise from automotive wholesale, logistics, and technology to create a platform that removes traditional barriers in the B2B vehicle trade. Starting with a focus on connecting German suppliers with Eastern European dealers, we've since expanded to become a comprehensive solution for professional vehicle trading across the continent.
            </p>
            <p className="text-lg text-neutral-700 mb-6">
              Today, BidVista facilitates thousands of transactions monthly, with verified dealers from 18 countries trusting our platform for inventory sourcing, secure payments, and seamless logistics. Our commitment to professionalism, transparency, and innovation drives everything we do.
            </p>
          </div>
        </Container>
      </div>

      {/* Timeline */}
      <div className="bg-neutral-50 py-16">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-neutral-200"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12 relative">
              {timeline.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2 md:pr-12 md:pl-12 text-center md:text-right">
                    <div className={`inline-block p-2 rounded-lg mb-3 ${index % 2 === 0 ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'}`}>
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                  <div className="mx-auto md:mx-0 my-4 md:my-0 flex-shrink-0 relative">
                    <div className="h-12 w-12 rounded-full bg-primary-500 border-4 border-white shadow flex items-center justify-center text-white font-bold">
                      {item.year.slice(-2)}
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:pr-12 text-center md:text-left">
                    {index % 2 === 0 ? (
                      <div className="hidden md:block">
                        <div className="h-4 w-4"></div>
                      </div>
                    ) : (
                      <>
                        <div className="inline-block p-2 rounded-lg mb-3 bg-primary-100 text-primary-800">
                          {item.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-neutral-600">{item.description}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Our Mission */}
      <div className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image 
                src="/images/about/mission.jpg"
                alt="Professionals inspecting vehicles at a BidVista auction facility"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-700 mb-6">
                We're on a mission to create the most trusted B2B vehicle marketplace in Europe, removing barriers to cross-border trade and enabling dealers of all sizes to thrive in an increasingly competitive market.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-md text-primary-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Transparency</h3>
                    <p className="text-neutral-600">Clear vehicle histories, unbiased condition reports, and straightforward pricing on every listing.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-md text-primary-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Security</h3>
                    <p className="text-neutral-600">Rigorous dealer verification, secure payment processing, and transaction protection for all parties.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-md text-primary-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Efficiency</h3>
                    <p className="text-neutral-600">Streamlined processes for sourcing, bidding, payment, and logistics to save dealers time and resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Leadership Team */}
      <div className="bg-neutral-50 py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-neutral-600">
              Meet the experienced professionals driving BidVista's innovation and growth in the automotive B2B space.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm transition-transform hover:transform hover:scale-105">
                <div className="relative h-64 bg-neutral-200">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} at BidVista`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-neutral-900">{member.name}</h3>
                  <p className="text-primary-600 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-neutral-600 text-sm">{member.bio}</p>
                  <div className="flex mt-4 space-x-3">
                    <a href="#" className="text-neutral-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1" aria-label="Twitter profile">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-neutral-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1" aria-label="GitHub profile">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-neutral-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1" aria-label="Dribbble profile">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Global Presence */}
      <div className="bg-neutral-900 text-white py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Global Presence</h2>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
              BidVista connects dealers across 18 European countries, with offices in Germany, Poland, and Romania.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/about/europe-map.jpg"
                alt="Map showing BidVista's presence across 18 European countries with highlighted offices in Germany, Poland, and Romania"
                fill
                className="object-contain"
                sizes="100vw"
              />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 to-neutral-900/0"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
            <div className="bg-neutral-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-400">18+</p>
              <p className="text-neutral-400 text-sm">Countries</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-400">5,000+</p>
              <p className="text-neutral-400 text-sm">Verified Dealers</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-400">3</p>
              <p className="text-neutral-400 text-sm">Office Locations</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-400">42</p>
              <p className="text-neutral-400 text-sm">Transport Partners</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-400">100K+</p>
              <p className="text-neutral-400 text-sm">Transactions</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-400">24/7</p>
              <p className="text-neutral-400 text-sm">Support</p>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <Container>
          <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Dealership?</h2>
              <p className="text-lg text-white mb-8">
                Join thousands of professional dealers who trust BidVista for sourcing premium vehicles across borders.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/dealer-signup" aria-label="Register as a dealer">
                  <Button
                    {...{
                      size: "lg",
                      className: "focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 focus:outline-none"
                    } as any}
                  >
                    Register as Dealer
                  </Button>
                </Link>
                <Link href="/contact" aria-label="Contact our sales team">
                  <Button
                    {...{
                      variant: "outline",
                      size: "lg",
                      className: "text-white border-white hover:bg-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                    } as any}
                  >
                    Contact Sales Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default AboutPage;
