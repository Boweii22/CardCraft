import React from 'react';
import { motion } from 'framer-motion';
import { BusinessCard } from '../types';
import { Mail, Phone, Globe, Linkedin, Twitter } from 'lucide-react';

interface BusinessCardPreviewProps {
  card: BusinessCard;
  className?: string;
  disableAnimation?: boolean;
}

export const BusinessCardPreview: React.FC<BusinessCardPreviewProps> = ({ 
  card, 
  className = '',
  disableAnimation = false
}) => {
  const themeColors = {
    cyan: 'from-cyan-400 to-blue-500',
    purple: 'from-purple-400 to-pink-500',
    pink: 'from-pink-400 to-rose-500',
    green: 'from-green-400 to-emerald-500',
  };

  const minimalColors = {
    cyan: 'bg-cyan-900',
    purple: 'bg-purple-900',
    pink: 'bg-pink-900',
    green: 'bg-green-900',
  };

  const templates = {
    modern: 'bg-gradient-to-br',
    gradient: 'bg-gradient-to-r',
    minimal: minimalColors[card.colorTheme] || 'bg-gray-900',
    neon: 'bg-black border-2',
  };

  const getBorderColor = () => {
    switch (card.colorTheme) {
      case 'cyan': return 'border-cyan-400';
      case 'purple': return 'border-purple-400';
      case 'pink': return 'border-pink-400';
      case 'green': return 'border-green-400';
      default: return 'border-cyan-400';
    }
  };

  const getMinimalBorderColor = () => {
    switch (card.colorTheme) {
      case 'cyan': return 'border-cyan-600';
      case 'purple': return 'border-purple-600';
      case 'pink': return 'border-pink-600';
      case 'green': return 'border-green-600';
      default: return 'border-gray-700';
    }
  };

  const getMinimalAccentColor = () => {
    switch (card.colorTheme) {
      case 'cyan': return 'text-cyan-400';
      case 'purple': return 'text-purple-400';
      case 'pink': return 'text-pink-400';
      case 'green': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const cardElement = (
    <div
      id="business-card-preview"
      className={`
        w-96 h-56 p-6 rounded-2xl shadow-2xl relative overflow-hidden
        ${templates[card.template]} ${themeColors[card.colorTheme]}
        ${card.template === 'neon' ? getBorderColor() : ''}
        ${card.template === 'minimal' ? `border ${getMinimalBorderColor()}` : ''}
        ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white">
        <div>
          <h2 className={`text-2xl font-bold mb-1 ${card.template === 'minimal' ? getMinimalAccentColor() : ''}`}>
            {card.name || 'Your Name'}
          </h2>
          <p className="text-sm opacity-90 mb-1">{card.title || 'Your Title'}</p>
          {card.company && (
            <p className="text-sm opacity-80">{card.company}</p>
          )}
        </div>

        <div className="space-y-2">
          {card.email && (
            <div className="flex items-center text-sm opacity-90">
              <Mail size={14} className="mr-2" />
              {card.email}
            </div>
          )}
          {card.phone && (
            <div className="flex items-center text-sm opacity-90">
              <Phone size={14} className="mr-2" />
              {card.phone}
            </div>
          )}
          {card.website && (
            <div className="flex items-center text-sm opacity-90">
              <Globe size={14} className="mr-2" />
              {card.website}
            </div>
          )}
          
          <div className="flex space-x-3 pt-2">
            {card.linkedin && (
              <Linkedin size={16} className={`opacity-80 hover:opacity-100 cursor-pointer ${card.template === 'minimal' ? getMinimalAccentColor() : ''}`} />
            )}
            {card.twitter && (
              <Twitter size={16} className={`opacity-80 hover:opacity-100 cursor-pointer ${card.template === 'minimal' ? getMinimalAccentColor() : ''}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (disableAnimation) {
    return cardElement;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {cardElement}
    </motion.div>
  );
};