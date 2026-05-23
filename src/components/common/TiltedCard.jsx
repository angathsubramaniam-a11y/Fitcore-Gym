import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TiltedCard = ({
  imageSrc,
  altText = "Tilted card image",
  containerHeight = "500px",
  containerWidth = "350px",
  imageHeight = "500px",
  imageWidth = "350px",
  rotateAmplitude = 12,
  scaleOnHover = 1.15,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = true,
  overlayContent = null,
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${rotateAmplitude}deg`, `-${rotateAmplitude}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${rotateAmplitude}deg`, `${rotateAmplitude}deg`]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        width: containerWidth,
        height: containerHeight,
      }}
      whileHover={{ scale: scaleOnHover }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] group cursor-pointer border border-white/5"
    >
      <div 
        className="absolute inset-0 rounded-[20px] overflow-hidden bg-surface"
        style={{ width: imageWidth, height: imageHeight, transform: "translateZ(0px)" }}
      >
        <img src={imageSrc} alt={altText} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      
      {displayOverlayContent && overlayContent && (
        <div 
          className="absolute inset-0 rounded-[20px] flex flex-col justify-end p-6 pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
            transform: 'translateZ(40px)',
          }}
        >
          {overlayContent}
        </div>
      )}
    </motion.div>
  );
};

export default TiltedCard;
