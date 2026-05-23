import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import Plans from '../components/landing/Plans';
import Trainers from '../components/landing/Trainers';
import TransformationLab from '../components/landing/TransformationLab';
import Newsletter from '../components/landing/Newsletter';
import Footer from '../components/common/Footer';

const LandingPage = () => {
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
