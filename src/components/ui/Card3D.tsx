import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  flipOnHover?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({ 
  children, 
  className = '',
  flipOnHover = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (flipOnHover) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: flipOnHover ? 'pointer' : 'default' }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: flipOnHover ? 0 : rotateX,
          rotateY: flipOnHover ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: flipOnHover ? (isFlipped ? 180 : 0) : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        whileHover={flipOnHover ? {} : { scale: 1.05 }}
      >
        <div className="w-full h-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}; 