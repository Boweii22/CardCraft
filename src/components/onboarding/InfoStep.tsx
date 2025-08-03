import React from 'react';
import { motion } from 'framer-motion';
import { BusinessCard } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { BusinessCardPreview } from '../BusinessCardPreview';

interface InfoStepProps {
  card: BusinessCard;
  updateCard: (updates: Partial<BusinessCard>) => void;
  onComplete: () => void;
}

export const InfoStep: React.FC<InfoStepProps> = ({ 
  card, 
  updateCard, 
  onComplete 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Tell Us About You</h2>
        <p className="text-gray-300 text-lg">Fill in your details to create your business card</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={card.name}
              onChange={(value) => updateCard({ name: value })}
              required
            />
            <Input
              label="Job Title"
              placeholder="Software Engineer"
              value={card.title}
              onChange={(value) => updateCard({ title: value })}
              required
            />
          </div>

          <Input
            label="Company"
            placeholder="Tech Corp Inc."
            value={card.company}
            onChange={(value) => updateCard({ company: value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={card.email}
              onChange={(value) => updateCard({ email: value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={card.phone}
              onChange={(value) => updateCard({ phone: value })}
            />
          </div>

          <Input
            label="Website"
            placeholder="https://yourwebsite.com"
            value={card.website}
            onChange={(value) => updateCard({ website: value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="LinkedIn"
              placeholder="linkedin.com/in/johndoe"
              value={card.linkedin}
              onChange={(value) => updateCard({ linkedin: value })}
            />
            <Input
              label="Twitter"
              placeholder="@johndoe"
              value={card.twitter}
              onChange={(value) => updateCard({ twitter: value })}
            />
          </div>

          <div className="text-center pt-6">
            <Button type="submit" size="lg" className="px-12">
              Create My Card
            </Button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="flex flex-col items-center space-y-6">
          <div className="transform scale-75 origin-center">
            <BusinessCardPreview card={card} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};