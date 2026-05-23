import React from 'react';
import { Quote } from 'lucide-react';

const TransformationLab = () => {
  const transformations = [
    {
      name: "Angath Subramaniam S",
      plan: "Value Plan (6 Months)",
      result: "-15kg Fat Loss / +5kg Muscle",
      quote: "The trainers here don't just count reps, they guide you on biomechanics and nutrition."
    },
    {
      name: "Angesh Karthik S",
      plan: "Value Plan (3 Months)",
      result: "+10kg Muscle Gain",
      quote: "The culture here breeds a fit lifestyle. The equipments are well maintained and the coaching staff actually cares about your progression."
    }
  ];

  return (
    <section id="transformations" className="py-24 bg-surface border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-3">Success Lab</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">REAL <span className="text-primary">RESULTS</span></h2>
          <p className="text-textSecondary">Proof that our programming and infrastructure deliver elite outcomes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {transformations.map((t, idx) => (
            <div key={idx} className="bg-background rounded-xl p-8 border border-gray-800 relative">
              <Quote size={48} className="absolute top-6 right-6 text-gray-800 opacity-50" />
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <p className="text-lg text-white font-medium italic leading-relaxed mb-8">"{t.quote}"</p>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-heading text-xl font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{t.name}</h4>
                      <p className="text-textSecondary text-sm">{t.plan}</p>
                    </div>
                  </div>
                  <div className="mt-4 inline-block bg-primary/10 border border-primary/20 px-4 py-2 rounded-md">
                    <span className="text-primary font-bold text-sm tracking-wide">{t.result}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationLab;
