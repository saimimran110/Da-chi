import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Package, LogIn, UserPlus, Menu, Search } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import logo from "@/pages/logo.jpg"; // Import the logo from the pages directory

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const isLoggedIn = !!localStorage.getItem("userId"); // Check if user is logged in
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear the search input
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="header-link">Home</Link>
      <Link to="/perfumes" className="header-link">Perfumes</Link>
      <Link to="/deodorants" className="header-link">Deodorants</Link>
      <Link to="/lotions" className="header-link">Lotions</Link>
      <Link to="/orders" className="header-link flex items-center">
        <Package className="mr-1 h-4 w-4" />
        Orders
      </Link>
    </>
  );

  const AuthButtons = () => (
    <div className="flex items-center space-x-2">
      {isLoggedIn ? (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center border-black text-black hover:bg-black hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center"
            onClick={() => navigate("/auth")}
          >
            <LogIn className="mr-1 h-4 w-4" />
            Login
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center bg-black hover:bg-gray-800"
            onClick={() => navigate("/auth")}
          >
            <UserPlus className="mr-1 h-4 w-4" />
            Sign Up
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-sm sticky top-8 z-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between py-4">
        
        {/* Logo Section */}
        <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-12 w-auto object-cover" 
            /> {/* Replace DA-CHI with logo */}
          </Link>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[385px]">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavLinks />
                </nav>
                <div className="mt-8">
                  <AuthButtons />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Navigation Links, Search Bar, and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>

          {/* Conditionally Render Search Bar */}
          {location.pathname === "/" && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </form>
          )}

          {!isMobile && <AuthButtons />}

          {/* Cart Button */}
          <Link to="/cart">
            <Button variant="ghost" className="relative p-2 hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;