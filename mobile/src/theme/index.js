import { colors } from './colors';

export const theme = {
  colors,
  
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 999
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5.46,
      elevation: 5
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 9.51,
      elevation: 10
    }
  }
};