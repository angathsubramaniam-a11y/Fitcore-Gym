import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const Plans = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const navigate = useNavigate();

  const monthlyPlans = [
    { name: 'Starter', price: 600, duration: '1 Month', features: ['General Floor Access', 'Basic App Access', 'Locker Room'] },
    { name: 'Value', price: 1500, duration: '3 Months', features: ['General Floor Access', 'Basic App Access', 'Locker Room', '1 Free PT Session'] },
    { name: 'Pro', price: 2500, duration: '6 Months', isPopular: true, features: ['24/7 Floor Access', 'Pro App Access (Workouts)', 'Locker Room', 'Group Classes', '3 Free PT Sessions'] },
    { name: 'Elite', price: 4000, duration: '9 Months', features: ['24/7 Floor Access', 'Pro App Access', 'Sauna & Recovery', 'Group Classes', '5 Free PT Sessions'] }
  ];

  const yearlyPlans = [
    { name: 'Annual Pro', price: 6000, duration: '1 Year', isPopular: true, features: ['24/7 Floor Access', 'Pro App Access (Workouts)', 'Sauna & Recovery', 'Group Classes', 'Nutrition Guide'] },
    { name: 'Annual Beast', price: 8000, duration: '2 Years', features: ['24/7 Access Nationwide', 'Premium App Access', 'Sauna & Recovery', 'Unlimited Group Classes', 'Monthly PT Session'] }
  ];

  const displayPlans = activeTab === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <section id="plans" className="py-24 bg-surface border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-3">Membership Tiers</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">JOIN THE <span className="text-primary">MOVEMENT</span></h2>
          
          <div className="inline-flex bg-background p-1.5 rounded-md border border-gray-800 mb-8">
            <button 
              className={`px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'monthly' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-white'}`}
              onClick={() => setActiveTab('monthly')}
            >
              Short Term
            </button>
            <button 
              className={`px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'yearly' ? 'bg-primary text-white shadow-lg' : 'text-textSecondary hover:text-white'}`}
              onClick={() => setActiveTab('yearly')}
            >
              Annual Commits
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center">
          {displayPlans.map((plan, idx) => (
            <div key={idx} className={`relative bg-background rounded-xl border ${plan.isPopular ? 'border-primary shadow-[0_0_30px_rgba(232,85,62,0.15)] transform md:-translate-y-4' : 'border-gray-800'} p-8 flex flex-col h-full`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Chosen
                </div>
              )}
              
              <div className="mb-6 border-b border-gray-800 pb-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{plan.name}</h3>
                <p className="text-textSecondary text-sm mb-4 font-medium uppercase tracking-widest">{plan.duration}</p>
                <div className="text-5xl font-extrabold text-white mb-2">₹{plan.price}</div>
              </div>
              
              <ul className="flex-1 flex flex-col gap-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-primary" />
                    </span>
                    <span className="text-sm text-textSecondary font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => navigate('/member/login')} 
                className={`w-full py-3.5 rounded-md font-heading text-lg font-bold tracking-wider transition-all ${plan.isPopular ? 'bg-primary text-white hover:bg-primaryHover' : 'bg-surface text-white hover:bg-surfaceHover border border-gray-700'}`}
              >
                SELECT PACKAGE
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
