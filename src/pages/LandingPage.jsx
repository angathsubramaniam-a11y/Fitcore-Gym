import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import Plans from '../components/landing/Plans';
import Trainers from '../components/landing/Trainers';
import TransformationLab from '../components/landing/TransformationLab';
import Newsletter from '../components/landing/Newsletter';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Plans />
        <Trainers />
        <TransformationLab />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
