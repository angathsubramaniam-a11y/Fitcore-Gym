import React from 'react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import TiltedCard from '../common/TiltedCard';

const Trainers = () => {
  const trainers = [
    {
      image: "https://images4.alphacoders.com/933/thumb-1920-933854.jpg",
      name: "GOKU",
      category: "LEGENDARY BODYBUILDER",
      speciality: "Legend at everything"
    },
    {
      image: "https://www.hachette.co.uk/wp-content/uploads/2019/01/hbg-title-arnold-the-education-of-a-bodybuilder-8.jpg?resize=678,1024",
      name: "ARNOLD SCHWARZENEGGER",
      category: "THE BODYBUILDER",
      speciality: "HIIT & Functional Training"
    },
    {
      image: "https://i1.sndcdn.com/artworks-000539974686-caqtbu-t1080x1080.jpg",
      name: "DAVID GOGGINS",
      category: "BEAST MODE",
      speciality: "Running and Ultramarathons"
    },
    {
      image: "https://manmaker.in/cdn/shop/articles/cbum-31-07-2024-0001.jpg?v=1722450546",
      name: "CRIS BUMSTEAD",
      category: "Wight gain trainer",
      speciality: "Wight gain"
    },
    {
      image: "https://fitnessvolt.com/wp-content/uploads/2023/04/ronnie-coleman-at-his-best.jpg",
      name: "RONNIE COLEMAN",
      category: "8x Mr. Olympia",
      speciality: "Heavy Lifting"
    }
  ];

  return (
    <section id="trainers" className="py-24 bg-background border-b border-gray-800 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-3">Elite Roster</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">MEET YOUR <span className="text-primary">COACHES</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all z-10 cursor-pointer">
              <ChevronLeft size={24} />
            </button>
            <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all z-10 cursor-pointer">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative trainer-carousel w-full">
          <Swiper
            modules={[Autoplay, Navigation, Mousewheel, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            speed={800}
            mousewheel={{ forceToAxis: true }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="w-full py-12"
          >
            {trainers.map((trainer, idx) => (
              <SwiperSlide key={idx} className="flex justify-center items-center transition-transform duration-500">
                {({ isActive }) => (
                  <div className={`transition-all duration-700 flex justify-center w-full max-w-[350px] mx-auto ${isActive ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-50'}`}>
                    <TiltedCard
                      imageSrc={trainer.image}
                      altText={trainer.name}
                      containerHeight="500px"
                      containerWidth="350px"
                      imageHeight="500px"
                      imageWidth="350px"
                      rotateAmplitude={12}
                      scaleOnHover={1.15}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      overlayContent={
                        <div className="flex flex-col justify-end text-white text-left h-full pb-2 px-2">
                          <div className="flex items-center gap-2 mb-2 opacity-90">
                            <Award size={16} className="text-primary" />
                            <span className="text-primary text-xs font-bold tracking-widest uppercase">{trainer.category}</span>
                          </div>
                          <h3 className="text-3xl font-extrabold text-white mb-1 uppercase drop-shadow-lg tracking-tight">{trainer.name}</h3>
                          <p className="text-textSecondary font-medium text-sm drop-shadow-md">{trainer.speciality}</p>
                        </div>
                      }
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Trainers;
