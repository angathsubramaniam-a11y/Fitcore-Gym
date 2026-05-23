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

        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-lg font-heading tracking-wider mb-5">TRAINING</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Personal Coaching</Link></li>
            <li><Link to="/#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Strength Conditioning</Link></li>
            <li><Link to="/#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Yoga & flexibility</Link></li>
            <li><Link to="/#services" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Diet Protocols</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-heading tracking-wider mb-5">COMPANY</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/#about" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">About Fitcore</Link></li>
            <li><Link to="/#trainers" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Our Specialists</Link></li>
            <li><Link to="/#transformations" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Success Lab</Link></li>
            <li><Link to="/#plans" className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">Gym Rules</Link></li>
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
