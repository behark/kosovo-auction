import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface NavItemProps {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, active, onClick }) => (
  <li>
    <Link href={href}
      className={`block py-2 px-3 rounded-md transition-colors ${
        active 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-neutral-800 hover:bg-neutral-50 hover:text-primary-600'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
);

interface NavDropdownProps {
  label: string;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, children, mobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="relative">
      <button
        className={`flex items-center gap-1 py-2 px-3 rounded-md transition-colors w-full text-left ${
          mobile ? 'text-neutral-800' : 'text-neutral-800 hover:bg-neutral-50 hover:text-primary-600'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className={`${mobile ? 'pl-4' : 'absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg min-w-[200px] z-50'}`}>
          {children}
        </div>
      )}
    </li>
  );
};

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Check if current path matches the given href
  const isActive = (href: string) => router.pathname === href;

  // Listen for scroll to add shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white z-30 transition-shadow ${
      scrolled ? 'shadow-md' : ''
    }`}>
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">BidVista</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              <NavItem href="/" label="Home" active={isActive('/')} />
              <NavItem href="/auctions" label="Auctions" active={isActive('/auctions')} />
              <NavDropdown label="Vehicles">
                <div className="py-2">
                  <Link href="/vehicles" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    Browse Vehicles
                  </Link>
                  <Link href="/vehicles/coming-soon" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    Coming Soon
                  </Link>
                  <Link href="/vehicles/sold" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    Recently Sold
                  </Link>
                </div>
              </NavDropdown>
              <NavItem href="/services" label="Services" active={isActive('/services')} />
              <NavDropdown label="Support">
                <div className="py-2">
                  <Link href="/support" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    Contact Us
                  </Link>
                  <Link href="/support/knowledge-base" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    Knowledge Base
                  </Link>
                  <Link href="/support/tutorials" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    Video Tutorials
                  </Link>
                  <Link href="/support/tickets" 
                    className="block px-4 py-2 hover:bg-neutral-50 hover:text-primary-600">
                    My Tickets
                  </Link>
                </div>
              </NavDropdown>
              <NavItem href="/about" label="About Us" active={isActive('/about')} />
            </ul>
          </nav>

          {/* Auth buttons / User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle className="mr-2" />
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium">
                  <span>{session.user?.name || 'My Account'}</span>
                  <ChevronDownIcon />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-2">
                    <Link href="/dashboard" 
                      className="block px-4 py-2 rounded-md hover:bg-neutral-50 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link href="/profile" 
                      className="block px-4 py-2 rounded-md hover:bg-neutral-50 hover:text-primary-600">
                      Profile
                    </Link>
                    <Link href="/settings" 
                      className="block px-4 py-2 rounded-md hover:bg-neutral-50 hover:text-primary-600">
                      Settings
                    </Link>
                    <hr className="my-1 border-neutral-200" />
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 rounded-md text-error-600 hover:bg-error-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/signin" passHref>
                  <Button {...{variant: "outline", size: "default"} as any}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" passHref>
                  <Button {...{variant: "default", size: "default"} as any}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white shadow-lg">
          <Container padding={false}>
            <nav className="p-4">
              <ul className="space-y-2">
                <NavItem
                  href="/"
                  label="Home"
                  active={isActive('/')}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavItem
                  href="/auctions"
                  label="Auctions"
                  active={isActive('/auctions')}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavDropdown label="Vehicles" mobile>
                  <ul className="space-y-2 py-2">
                    <li>
                      <Link href="/vehicles"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Browse Vehicles
                      </Link>
                    </li>
                    <li>
                      <Link href="/vehicles/coming-soon"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Coming Soon
                      </Link>
                    </li>
                    <li>
                      <Link href="/vehicles/sold"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Recently Sold
                      </Link>
                    </li>
                  </ul>
                </NavDropdown>
                <NavItem
                  href="/services"
                  label="Services"
                  active={isActive('/services')}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavDropdown label="Support" mobile>
                  <ul className="space-y-2 py-2">
                    <li>
                      <Link href="/support"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/support/knowledge-base"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Knowledge Base
                      </Link>
                    </li>
                    <li>
                      <Link href="/support/tutorials"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Video Tutorials
                      </Link>
                    </li>
                    <li>
                      <Link href="/support/tickets"
                        className="block py-2 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Tickets
                      </Link>
                    </li>
                  </ul>
                </NavDropdown>
                <NavItem
                  href="/about"
                  label="About Us"
                  active={isActive('/about')}
                  onClick={() => setMobileMenuOpen(false)}
                />
                
                {/* Mobile auth buttons */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-200">
                  <ThemeToggle aria-label="Toggle dark mode" />
                  <div className="flex-1 ml-4">
                  {session ? (
                    <>
                      <div className="mb-3 px-3 text-sm font-medium text-neutral-500">
                        Signed in as: {session.user?.email}
                      </div>
                      <Link href="/dashboard"
                        className="block py-2 px-3 rounded-md hover:bg-neutral-50 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link href="/profile"
                        className="block py-2 px-3 rounded-md hover:bg-neutral-50 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link href="/settings"
                        className="block py-2 px-3 rounded-md hover:bg-neutral-50 hover:text-primary-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left py-2 px-3 mt-2 rounded-md text-error-600 hover:bg-error-50"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link href="/auth/signin" passHref>
                        <Button {...{variant: "outline", fullWidth: true} as any}>
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" passHref>
                        <Button {...{variant: "default", fullWidth: true} as any}>
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                  </div>
                </div>
              </ul>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Navigation;
