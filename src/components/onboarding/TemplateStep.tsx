import React from 'react';
import { motion } from 'framer-motion';
import { BusinessCard } from '../../types';
import { BusinessCardPreview } from '../BusinessCardPreview';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

interface TemplateStepProps {
  card: BusinessCard;
  updateCard: (updates: Partial<BusinessCard>) => void;
  onNext: () => void;
}

export const TemplateStep: React.FC<TemplateStepProps> = ({ 
  card, 
  updateCard, 
  onNext 
}) => {
  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean gradient design' },
    { id: 'gradient', name: 'Gradient', description: 'Bold color transitions' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'neon', name: 'Neon', description: 'Futuristic glow effect' },
  ];

  const handleTemplateSelect = (template: BusinessCard['template']) => {
    updateCard({ template });
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Style</h2>
        <p className="text-gray-300 text-lg">Select a template that represents your brand</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Template Selection */}
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${card.template === template.id 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-gray-700 bg-gray-900/20 hover:border-gray-600'
                }
              `}
              onClick={() => handleTemplateSelect(template.id as BusinessCard['template'])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                <p className="text-gray-400 text-xs">{template.description}</p>
              </div>
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