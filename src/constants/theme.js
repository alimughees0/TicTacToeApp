export const THEMES = {
  Default: {
    name: 'Deep Navy',
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#38BDF8',
    secondary: '#818CF8',
    accent: '#F472B6',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    x: '#38BDF8',
    o: '#F472B6',
  },
  Neon: {
    name: 'Cyber Neon',
    background: '#000000',
    surface: '#1A1A1A',
    primary: '#FF00FF', // Neon Magenta
    secondary: '#00FFFF', // Neon Cyan
    accent: '#FFFF00',
    text: '#FFFFFF',
    textSecondary: '#666666',
    x: '#FF00FF',
    o: '#00FFFF',
  },
  Retro: {
    name: 'Retro Beige',
    background: '#FDF6E3',
    surface: '#EEE8D5',
    primary: '#B58900',
    secondary: '#2AA198',
    accent: '#D33682',
    text: '#073642',
    textSecondary: '#586E75',
    x: '#B58900',
    o: '#2AA198',
  },
  Dark: {
    name: 'OLED Black',
    background: '#000000',
    surface: '#121212',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    accent: '#CF6679',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    x: '#BB86FC',
    o: '#03DAC6',
  }
};

export const COLORS = THEMES.Default; // Default fallback

export const SIZES = {
  padding: 20,
  borderRadius: 16,
  cell: 90,
};

export const FONTS = {
  bold: 'System',
  regular: 'System',
};
