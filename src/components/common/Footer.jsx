import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gray-800 pt-16 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand */}
        <div className="flex flex-col gap-4 md:col-span-1.5">
          <Link to="/" className="text-3xl font-extrabold font-heading tracking-tight flex items-center gap-2">
            <span className="text-primary">⚡</span> FITCORE
          </Link>
          <p className="text-textSecondary text-sm leading-relaxed">
            ELITE PERFORMANCE CENTER. WE PROVIDE THE PLATFORM, WORKOUT ROUTINES, NUTRITION INFRASTRUCTURE, AND TEAM OF MASTER COACHES TO UNLEASH YOUR INNER BEAST.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="p-2 bg-background border border-gray-800 rounded-full text-textSecondary hover:bg-primary hover:text-white hover:border-primary transition-all hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="p-2 bg-background border border-gray-800 rounded-full text-textSecondary hover:bg-primary hover:text-white hover:border-primary transition-all hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="p-2 bg-background border border-gray-800 rounded-full text-textSecondary hover:bg-primary hover:text-white hover:border-primary transition-all hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="p-2 bg-background border border-gray-800 rounded-full text-textSecondary hover:bg-primary hover:text-white hover:border-primary transition-all hover:-translate-y-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-lg font-heading tracking-wider mb-5">TRAINING</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Personal Coaching</a></li>
            <li><a href="#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Strength Conditioning</a></li>
            <li><a href="#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Yoga & flexibility</a></li>
            <li><a href="#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Diet Protocols</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-heading tracking-wider mb-5">COMPANY</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="#about" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">About Fitcore</a></li>
            <li><a href="#trainers" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Our Specialists</a></li>
            <li><a href="#transformations" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Success Lab</a></li>
            <li><a href="#plans" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Gym Rules</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-heading tracking-wider mb-5">PORTALS & SERVICES</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/member/login" className="flex items-center text-sm font-medium text-textSecondary hover:text-primary transition-colors group">
                <UserCheck size={16} className="mr-2 group-hover:text-primary" /> Member Login
              </Link>
            </li>
            <li>
              <Link to="/trainer/login" className="flex items-center text-sm font-medium text-textSecondary hover:text-primary transition-colors group">
                <UserCheck size={16} className="mr-2 group-hover:text-primary" /> Trainer Portal
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="flex items-center text-sm font-medium text-textSecondary hover:text-primary transition-colors group">
                <Shield size={16} className="mr-2 group-hover:text-primary" /> Admin Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 border-t border-gray-800 text-center">
        <p className="text-xs font-medium text-gray-500 tracking-wider">&copy; {new Date().getFullYear()} FITCORE. ALL RIGHTS RESERVED. FORGED BY ELITE ATHLETES.</p>
      </div>
    </footer>
  );
};

export default Footer;
