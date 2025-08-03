import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BusinessCard } from '../types';
import { BusinessCardPreview } from './BusinessCardPreview';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { Plus, Edit3, Trash2, Download, Share2 } from 'lucide-react';
import { exportCardAsPNG } from '../utils/exportUtils';
import { shareCard, canShare, shareCardAsImage } from '../utils/pwaUtils';

interface DashboardProps {
  cards: BusinessCard[];
  onCreateNew: () => void;
  onEditCard: (card: BusinessCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cards,
  onCreateNew,
  onEditCard,
  onDeleteCard,
}) => {
  const [exportingCard, setExportingCard] = useState<string | null>(null);
  const [sharingCard, setSharingCard] = useState<string | null>(null);

  const handleExportCard = async (card: BusinessCard) => {
    setExportingCard(card.id);
    try {
      // Create a temporary preview element for export
      const tempDiv = document.createElement('div');
      tempDiv.id = `export-card-${card.id}`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '400px';
      tempDiv.style.height = '300px';
      tempDiv.style.backgroundColor = 'transparent';
      document.body.appendChild(tempDiv);

      // Render the card preview
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      
      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(BusinessCardPreview, { 
            card, 
            className: 'w-96 h-56', // Use fixed dimensions instead of scale
            disableAnimation: true // Disable animations for export
          })
        );
        // Give more time for rendering
        setTimeout(resolve, 500);
      });

      await exportCardAsPNG(`export-card-${card.id}`, `${card.name || 'business-card'}-business-card.png`);
      
      // Cleanup
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export card. Please try again.');
    } finally {
      setExportingCard(null);
    }
  };

  const handleShareCard = async (card: BusinessCard) => {
    setSharingCard(card.id);
    try {
      // Create a temporary preview element for sharing
      const tempDiv = document.createElement('div');
      tempDiv.id = `share-card-${card.id}`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '400px';
      tempDiv.style.height = '300px';
      tempDiv.style.backgroundColor = 'transparent';
      document.body.appendChild(tempDiv);

      // Render the card preview
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      
      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(BusinessCardPreview, { 
            card, 
            className: 'w-96 h-56',
            disableAnimation: true
          })
        );
        setTimeout(resolve, 500);
      });

      // Try to share as image first
      await shareCardAsImage(`share-card-${card.id}`, card);
      
      // Cleanup
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback to text sharing
      await shareCard(
        card,
        `${card.name || 'Business Card'}`,
        `Check out this business card created with CardCraft!`,
      );
    } finally {
      setSharingCard(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Business Cards</span>
          </h1>
          <p className="text-xl text-gray-300">Manage and create stunning business cards</p>
        </motion.div>

        {/* Create New Card Button */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button onClick={onCreateNew} size="lg" className="px-8">
            <Plus size={24} />
            Create New Card
          </Button>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <GlassCard className="p-6 space-y-6">
                <div className="flex justify-center">
                  <div className="transform scale-75 origin-center">
                    <BusinessCardPreview card={card} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">{card.name}</h3>
                    <p className="text-gray-400 text-sm">{card.title}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Created {new Date(card.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEditCard(card)}
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExportCard(card)}
                      loading={exportingCard === card.id}
                    >
                      <Download size={16} />
                    </Button>
                    {canShare() && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleShareCard(card)}
                        loading={sharingCard === card.id}
                      >
                        <Share2 size={16} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteCard(card.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {cards.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-gray-400 text-lg mb-4">No business cards yet</div>
            <p className="text-gray-500">Click "Create New Card" to get started!</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          className="text-center py-8 mt-16 border-t border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-gray-400 text-sm">
            <p>Created with ❤️ by <span className="text-cyan-400 font-medium"><a href="https://github.com/Boweii22" target="_blank" rel="noopener noreferrer">Bowei Tombri</a></span></p>
            <p className="mt-1 text-gray-500">CardCraft v1.0.0</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};