import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BusinessCard } from '../types';
import { BusinessCardPreview } from './BusinessCardPreview';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { Input } from './ui/Input';
import { exportCardAsPNG } from '../utils/exportUtils';
import { shareCard, canShare, shareCardAsImage } from '../utils/pwaUtils';
import { ArrowLeft, Download, Share2, Save, Palette, Layout } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CardBuilderProps {
  card: BusinessCard;
  onSave: (card: BusinessCard) => void;
  onBack: () => void;
  isNewCard?: boolean;
  isEditing?: boolean;
}

export const CardBuilder: React.FC<CardBuilderProps> = ({ 
  card, 
  onSave, 
  onBack,
  isNewCard = false,
  isEditing = false
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCard, setEditingCard] = useState<BusinessCard>(card);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportCardAsPNG('business-card-preview', `${card.name}-business-card.png`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      // Try to share as image first
      await shareCardAsImage('business-card-preview', editingCard);
      // Trigger confetti celebration for successful share
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#8b5cf6']
      });
    } catch (error) {
      // Fallback to text sharing
      await shareCard(
        editingCard,
        `${editingCard.name || 'My Business Card'}`,
        `Check out my business card created with CardCraft!`,
      );
      // Still trigger confetti for successful text share
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave(editingCard);
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateCard = (updates: Partial<BusinessCard>) => {
    setEditingCard({ ...editingCard, ...updates });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={20} />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Card Builder</h1>
          <div /> {/* Spacer */}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Preview */}
          <motion.div
            className="flex flex-col items-center space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-8" hover={false}>
              <BusinessCardPreview card={editingCard} />
            </GlassCard>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={handleSave} loading={isSaving}>
                <Save size={18} />
                Save Card
              </Button>
              <Button onClick={handleExport} loading={isExporting} variant="secondary">
                <Download size={18} />
                Download PNG
              </Button>
              {canShare() && (
                <Button onClick={handleShare} variant="ghost">
                  <Share2 size={18} />
                  Share
                </Button>
              )}
            </div>
          </motion.div>

          {/* Card Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {(isNewCard || isEditing) ? (
              // Editable form for new cards or when editing
              <>
                {/* Template and Color Selection (only when editing) */}
                {isEditing && (
                  <>
                    <GlassCard className="p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Layout size={24} />
                        Card Style
                      </h2>
                      <div className="space-y-6">
                        {/* Template Selection */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Template</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {['modern', 'gradient', 'minimal', 'neon'].map((template) => (
                              <button
                                key={template}
                                onClick={() => updateCard({ template: template as any })}
                                className={`
                                  p-3 rounded-lg border-2 transition-all duration-200 text-left
                                  ${editingCard.template === template 
                                    ? 'border-cyan-400 bg-cyan-400/10' 
                                    : 'border-gray-700 bg-gray-900/20 hover:border-gray-600'
                                  }
                                `}
                              >
                                <div className="text-white font-medium capitalize">{template}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Palette size={20} />
                            Color Theme
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'cyan', name: 'Cyan', gradient: 'from-cyan-400 to-blue-500' },
                              { id: 'purple', name: 'Purple', gradient: 'from-purple-400 to-pink-500' },
                              { id: 'pink', name: 'Pink', gradient: 'from-pink-400 to-rose-500' },
                              { id: 'green', name: 'Green', gradient: 'from-green-400 to-emerald-500' },
                            ].map((color) => (
                              <button
                                key={color.id}
                                onClick={() => updateCard({ colorTheme: color.id as any })}
                                className={`
                                  relative p-3 rounded-lg transition-all duration-200
                                  bg-gradient-to-br ${color.gradient}
                                  ${editingCard.colorTheme === color.id 
                                    ? 'ring-2 ring-white ring-opacity-50' 
                                    : 'hover:scale-105'
                                  }
                                `}
                              >
                                <div className="text-white font-medium">{color.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </>
                )}

                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Card Details</h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      value={editingCard.name}
                      onChange={(value) => updateCard({ name: value })}
                      required
                    />
                    <Input
                      label="Job Title"
                      placeholder="Software Engineer"
                      value={editingCard.title}
                      onChange={(value) => updateCard({ title: value })}
                      required
                    />
                    <Input
                      label="Company"
                      placeholder="Tech Corp Inc."
                      value={editingCard.company}
                      onChange={(value) => updateCard({ company: value })}
                    />
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      value={editingCard.email}
                      onChange={(value) => updateCard({ email: value })}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={editingCard.phone}
                      onChange={(value) => updateCard({ phone: value })}
                    />
                    <Input
                      label="Website"
                      placeholder="https://yourwebsite.com"
                      value={editingCard.website}
                      onChange={(value) => updateCard({ website: value })}
                    />
                    <Input
                      label="LinkedIn"
                      placeholder="linkedin.com/in/johndoe"
                      value={editingCard.linkedin}
                      onChange={(value) => updateCard({ linkedin: value })}
                    />
                    <Input
                      label="Twitter"
                      placeholder="@johndoe"
                      value={editingCard.twitter}
                      onChange={(value) => updateCard({ twitter: value })}
                    />
                  </div>
                </GlassCard>
              </>
            ) : (
              // Read-only view for existing cards
              <>
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Card Details</h2>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <span className="text-gray-400 text-sm">Name:</span>
                      <p className="text-white font-medium">{card.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Title:</span>
                      <p className="text-white font-medium">{card.title}</p>
                    </div>
                    {card.company && (
                      <div>
                        <span className="text-gray-400 text-sm">Company:</span>
                        <p className="text-white font-medium">{card.company}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 text-sm">Template:</span>
                      <p className="text-white font-medium capitalize">{card.template}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Color Theme:</span>
                      <p className="text-white font-medium capitalize">{card.colorTheme}</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                  <div className="space-y-3 text-gray-300">
                    {card.email && (
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm w-20">Email:</span>
                        <p className="text-white">{card.email}</p>
                      </div>
                    )}
                    {card.phone && (
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm w-20">Phone:</span>
                        <p className="text-white">{card.phone}</p>
                      </div>
                    )}
                    {card.website && (
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm w-20">Website:</span>
                        <p className="text-white">{card.website}</p>
                      </div>
                    )}
                    {card.linkedin && (
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm w-20">LinkedIn:</span>
                        <p className="text-white">{card.linkedin}</p>
                      </div>
                    )}
                    {card.twitter && (
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm w-20">Twitter:</span>
                        <p className="text-white">{card.twitter}</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="text-center py-6 mt-12 border-t border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-gray-400 text-sm">
          <p>Created with ❤️ by <span className="text-cyan-400 font-medium"><a href="https://github.com/Boweii22" target="_blank" rel="noopener noreferrer">Bowei Tombri</a></span></p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};