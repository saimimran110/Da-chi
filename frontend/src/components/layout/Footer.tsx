
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-playfair font-semibold mb-4">Da-Chi</h3>
            <p className="text-gray-400 mb-4">
              Premium fragrances, deodorants, and lotions crafted to enhance your personal style.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/perfumes" className="text-gray-400 hover:text-white transition-colors">Perfumes</Link></li>
              <li><Link to="/deodorants" className="text-gray-400 hover:text-white transition-colors">Deodorants</Link></li>
              <li><Link to="/lotions" className="text-gray-400 hover:text-white transition-colors">Lotions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-400">
              <p>Email: info@dachi.com</p>
              <p>Phone: +92 3332306480</p>
              <p>Address: Lahore Riwind Road Lahaore</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Da-Chi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
