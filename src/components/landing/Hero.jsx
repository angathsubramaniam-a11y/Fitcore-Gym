import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center pt-20">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col items-start mt-10">
        <div className="inline-block px-3 py-1 bg-primary/20 border border-primary/40 rounded-sm mb-6">
          <span className="text-primary text-xs font-bold tracking-widest uppercase">Elite Training Facility</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-[0.9] tracking-tight mb-6 max-w-3xl">
          FORGE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primaryHover">ULTIMATE</span> PHYSIQUE
        </h1>
        
        <p className="text-lg md:text-xl text-textSecondary mb-10 max-w-xl font-medium leading-relaxed">
          Access world-class equipment, elite coaching, and custom nutrition protocols designed to push you beyond your limits.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a href="#plans" className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-md font-heading text-xl font-bold tracking-wider hover:bg-primaryHover transition-all hover:scale-105 shadow-[0_0_20px_rgba(232,85,62,0.4)]">
            JOIN THE ELITE <ArrowRight size={20} />
          </a>
          <a href="#services" className="flex items-center gap-3 bg-surface text-white px-8 py-4 rounded-md font-heading text-xl font-bold tracking-wider hover:bg-surfaceHover border border-gray-800 transition-all hover:border-gray-600">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary"><Play size={14} fill="currentColor" /></span>
            VIEW FACILITY
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 w-full border-t border-gray-800 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-800/50">
          <div className="text-center px-4">
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary mb-1">50K+</h3>
            <p className="text-xs font-bold text-textSecondary tracking-widest uppercase">Sq Ft Facility</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">24/7</h3>
            <p className="text-xs font-bold text-textSecondary tracking-widest uppercase">Access Time</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">15+</h3>
            <p className="text-xs font-bold text-textSecondary tracking-widest uppercase">Master Coaches</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">100%</h3>
            <p className="text-xs font-bold text-textSecondary tracking-widest uppercase">Results Driven</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
