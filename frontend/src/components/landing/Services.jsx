import React from 'react';
import { Dumbbell, Users, Apple, Heart } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Dumbbell size={28} />,
      title: "PERSONAL TRAINING",
      desc: "Work 1-on-1 with our master coaches to build a physique protocol tailored exclusively for your genetics."
    },
    {
      icon: <Apple size={28} />,
      title: "NUTRITION LAB",
      desc: "Get precise macro splits and meal guidelines updated dynamically to fuel your hypertrophy and recovery."
    },
    {
      icon: <Users size={28} />,
      title: "GROUP CONDITIONING",
      desc: "High-intensity metabolic conditioning classes designed to shred fat and build elite endurance."
    },
    {
      icon: <Heart size={28} />,
      title: "RECOVERY ZONE",
      desc: "Access cryotherapy, infrared saunas, and sports massage to optimize your CNS and muscle recovery."
    }
  ];

  return (
    <section id="services" className="py-24 bg-background border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-3">Facility Offerings</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">ENGINEERED FOR <span className="text-primary">RESULTS</span></h2>
          <p className="text-textSecondary">We don't just provide equipment. We provide a complete ecosystem for athletic development and aesthetic transformation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-surface p-8 rounded-xl border border-gray-800 hover:border-primary transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {srv.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{srv.title}</h3>
              <p className="text-sm text-textSecondary leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
