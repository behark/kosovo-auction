import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import BackToTopButton from '../ui/BackToTopButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Layout;
