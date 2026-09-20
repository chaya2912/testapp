export type ThemeId = 'sapphire' | 'aurora' | 'twilight' | 'ember' | 'slate';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  badge: string;
  previewColors: [string, string, string]; // [canvas, surface, accent]
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    description: 'Deep cosmic navy with royal sapphire & electric azure accents',
    badge: 'Default',
    previewColors: ['#070b19', '#0d152d', '#60a5fa'],
  },
  {
    id: 'aurora',
    name: 'Emerald Aurora',
    description: 'Deep boreal obsidian with glowing arctic northern lights',
    badge: 'Boreal',
    previewColors: ['#050d0a', '#091913', '#34d399'],
  },
  {
    id: 'twilight',
    name: 'Cosmic Twilight',
    description: 'Celestial violet dusk with electric amethyst & lavender glow',
    badge: 'Mystic',
    previewColors: ['#0c0717', '#160e29', '#c084fc'],
  },
  {
    id: 'ember',
    name: 'Solar Ember',
    description: 'Espresso onyx with warm golden sunset & amber twilight',
    badge: 'Warm',
    previewColors: ['#120c07', '#1c140c', '#fbbf24'],
  },
  {
    id: 'slate',
    name: 'Nordic Slate',
    description: 'Classic Scandinavian dark slate with cyan accents',
    badge: 'Classic',
    previewColors: ['#020617', '#0f172a', '#22d3ee'],
  },
];
