/**
 * CardCraft - Business Card Creator
 * 
 * A modern business card creator with beautiful designs and PWA capabilities.
 * 
 * @author Bowei
 * @version 1.0.0
 * @description Create stunning business cards with multiple templates and color themes
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BusinessCard } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { installPWA } from './utils/pwaUtils';
import { Dashboard } from './components/Dashboard';
import { CardBuilder } from './components/CardBuilder';
import { Button } from './components/ui/Button';
import { WelcomeStep } from './components/onboarding/WelcomeStep';
import { TemplateStep } from './components/onboarding/TemplateStep';
import { ColorStep } from './components/onboarding/ColorStep';
import { InfoStep } from './components/onboarding/InfoStep';

type AppState = 'dashboard' | 'onboarding' | 'builder';
type OnboardingStep = 'welcome' | 'template' | 'color' | 'info';

function App() {
  const [cards, setCards] = useLocalStorage<BusinessCard[]>('business-cards', []);
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [currentCard, setCurrentCard] = useState<BusinessCard | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('has-seen-onboarding', false);

  useEffect(() => {
    // Install PWA service worker
    installPWA();
  }, []);

  const createNewCard = (): BusinessCard => ({
    id: `card-${Date.now()}`,
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    template: 'modern',
    colorTheme: 'cyan',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const handleCreateNew = () => {
    console.log('Creating new card, hasSeenOnboarding:', hasSeenOnboarding);
    const newCard = createNewCard();
    setCurrentCard(newCard);
    
    // Skip welcome step, start directly with template selection
    setOnboardingStep('template');
    setAppState('onboarding');
  };

  const handleEditCard = (card: BusinessCard) => {
    setCurrentCard(card);
    setAppState('builder');
  };

  const handleSaveCard = (card: BusinessCard) => {
    const updatedCard = { ...card, updatedAt: Date.now() };
    
    const existingIndex = cards.findIndex(c => c.id === card.id);
    if (existingIndex >= 0) {
      const updatedCards = [...cards];
      updatedCards[existingIndex] = updatedCard;
      setCards(updatedCards);
    } else {
      setCards([...cards, updatedCard]);
    }
    
    setAppState('dashboard');
    setCurrentCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const updateCurrentCard = (updates: Partial<BusinessCard>) => {
    if (currentCard) {
      setCurrentCard({ ...currentCard, ...updates });
    }
  };

  const handleOnboardingNext = () => {
    switch (onboardingStep) {
      case 'template':
        setOnboardingStep('color');
        break;
      case 'color':
        setOnboardingStep('info');
        break;
      case 'info':
        // Save the card and return to dashboard when onboarding is complete
        if (currentCard) {
          handleSaveCard(currentCard);
        }
        // Mark onboarding as seen if it's the first time
        if (!hasSeenOnboarding) {
          setHasSeenOnboarding(true);
        }
        break;
    }
  };

  const handleOnboardingBack = () => {
    switch (onboardingStep) {
      case 'template':
        // Go back to dashboard if we're at the first step
        setAppState('dashboard');
        setCurrentCard(null);
        break;
      case 'color':
        setOnboardingStep('template');
        break;
      case 'info':
        setOnboardingStep('color');
        break;
    }
  };

  const renderOnboardingStep = () => {
    if (!currentCard) return null;

    switch (onboardingStep) {
      case 'welcome':
        return <WelcomeStep onNext={handleOnboardingNext} />;
      case 'template':
        return (
          <TemplateStep
            card={currentCard}
            updateCard={updateCurrentCard}
            onNext={handleOnboardingNext}
          />
        );
      case 'color':
        return (
          <ColorStep
            card={currentCard}
            updateCard={updateCurrentCard}
            onNext={handleOnboardingNext}
          />
        );
      case 'info':
        return (
          <InfoStep
            card={currentCard}
            updateCard={updateCurrentCard}
            onComplete={handleOnboardingNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <AnimatePresence mode="wait">
        {appState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              cards={cards}
              onCreateNew={handleCreateNew}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          </motion.div>
        )}

        {appState === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <div className="w-full max-w-4xl">
              {/* Back Button */}
              <motion.div
                className="flex justify-start mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button variant="ghost" onClick={handleOnboardingBack}>
                  <ArrowLeft size={20} />
                  Back
                </Button>
              </motion.div>

              {/* Progress Indicator */}
              <div className="flex justify-center mb-12">
                <div className="flex space-x-2">
                  {['template', 'color', 'info'].map((step, index) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        ['template', 'color', 'info'].indexOf(onboardingStep) >= index
                          ? 'bg-cyan-400'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={onboardingStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderOnboardingStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {appState === 'builder' && currentCard && (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardBuilder
              card={currentCard}
              onSave={handleSaveCard}
              onBack={() => {
                setAppState('dashboard');
                setCurrentCard(null);
              }}
              isNewCard={false}
              isEditing={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;