import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-gradient-to-br from-primary to-primaryHover rounded-2xl p-12 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">JOIN THE INNER CIRCLE</h2>
            <p className="text-white/90 font-medium text-lg">
              Subscribe to get exclusive training tips, nutrition macro guides, and early access to membership discounts.
            </p>
          </div>

          <div className="relative z-10 w-full max-w-md">
            {subscribed ? (
              <div className="bg-white/20 backdrop-blur-sm border border-white/40 text-white p-6 rounded-xl flex items-center justify-center font-bold tracking-wider">
                ✓ WELCOME TO THE ELITE
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/60 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-white text-primary px-6 py-4 rounded-xl font-heading text-xl font-bold tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-xl">
                  SUBSCRIBE <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
