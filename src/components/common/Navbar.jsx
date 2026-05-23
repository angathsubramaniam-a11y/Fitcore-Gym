import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold font-heading tracking-tight flex items-center gap-2 group">
          <span className="text-primary group-hover:animate-pulse">⚡</span>
          <span>FITCORE</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-semibold tracking-wider text-textSecondary hover:text-primary transition-colors">SERVICES</a>
          <a href="#plans" className="text-sm font-semibold tracking-wider text-textSecondary hover:text-primary transition-colors">PLANS</a>
          <a href="#trainers" className="text-sm font-semibold tracking-wider text-textSecondary hover:text-primary transition-colors">TRAINERS</a>
          <a href="#transformations" className="text-sm font-semibold tracking-wider text-textSecondary hover:text-primary transition-colors">RESULTS</a>
          <Link to="/member/login" className="px-6 py-2 bg-primary text-textPrimary font-bold text-sm tracking-wider rounded hover:bg-primaryHover transition-all shadow-[0_0_15px_rgba(232,85,62,0.4)] hover:shadow-[0_0_20px_rgba(232,85,62,0.6)]">MEMBER LOGIN</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-textPrimary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-t border-gray-800 shadow-2xl flex flex-col p-6 gap-6">
          <a href="#services" onClick={() => setIsOpen(false)} className="text-lg font-bold text-textSecondary hover:text-primary">SERVICES</a>
          <a href="#plans" onClick={() => setIsOpen(false)} className="text-lg font-bold text-textSecondary hover:text-primary">PLANS</a>
          <a href="#trainers" onClick={() => setIsOpen(false)} className="text-lg font-bold text-textSecondary hover:text-primary">TRAINERS</a>
          <a href="#transformations" onClick={() => setIsOpen(false)} className="text-lg font-bold text-textSecondary hover:text-primary">RESULTS</a>
          <Link to="/member/login" onClick={() => setIsOpen(false)} className="mt-2 text-center py-3 bg-primary text-textPrimary font-bold text-lg rounded shadow-[0_0_15px_rgba(232,85,62,0.4)]">MEMBER LOGIN</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
