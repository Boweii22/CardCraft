import React from 'react';
import { motion } from 'framer-motion';
import { BusinessCard } from '../../types';
import { BusinessCardPreview } from '../BusinessCardPreview';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

interface ColorStepProps {
  card: BusinessCard;
  updateCard: (updates: Partial<BusinessCard>) => void;
  onNext: () => void;
}

export const ColorStep: React.FC<ColorStepProps> = ({ 
  card, 
  updateCard, 
  onNext 
}) => {
  const colors = [
    { id: 'cyan', name: 'Cyan', gradient: 'from-cyan-400 to-blue-500' },
    { id: 'purple', name: 'Purple', gradient: 'from-purple-400 to-pink-500' },
    { id: 'pink', name: 'Pink', gradient: 'from-pink-400 to-rose-500' },
    { id: 'green', name: 'Green', gradient: 'from-green-400 to-emerald-500' },
  ];

  const handleColorSelect = (colorTheme: BusinessCard['colorTheme']) => {
    updateCard({ colorTheme });
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pick Your Colors</h2>
        <p className="text-gray-300 text-lg">Choose a color theme that matches your personality</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Color Selection */}
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color, index) => (
            <motion.div
              key={color.id}
              className={`
                relative p-6 rounded-xl cursor-pointer transition-all duration-300
                bg-gradient-to-br ${color.gradient}
                ${card.colorTheme === color.id 
                  ? 'ring-4 ring-white ring-opacity-30 scale-105' 
                  : 'hover:scale-105'
                }
              `}
              onClick={() => handleColorSelect(color.id as BusinessCard['colorTheme'])}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center text-white">
                <h3 className="text-lg font-semibold">{color.name}</h3>
              </div>
              
              {card.colorTheme === color.id && (
                <motion.div
                  className="absolute inset-0 border-2 border-white rounded-xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Live Preview */}
        <div className="flex flex-col items-center space-y-6">
          <div className="transform scale-75 origin-center">
            <BusinessCardPreview card={card} />
          </div>
          <Button onClick={onNext} size="lg" className="px-8">
            Continue <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};