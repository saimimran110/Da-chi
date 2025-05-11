
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-black text-white text-center py-3 text-sm font-medium tracking-wide sticky top-0 z-50 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            FREE SHIPPING ON ALL ORDERS OVER Rs. 2000
          </div>
        </div>
      </div>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
