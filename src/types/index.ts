export interface BusinessCard {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  template: 'modern' | 'gradient' | 'minimal' | 'neon';
  colorTheme: 'cyan' | 'purple' | 'pink' | 'green';
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}