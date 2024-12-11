import { createTheme } from '@mui/material/styles';

// Definindo as cores
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Cor principal 
    },
    secondary: {
      main: '#2196F3', // background
    },
    tertiary: {
      main: '#2196F3', // 
    },
    // Você também pode configurar outras cores como backgrounds, texto, etc.
    background: {
      default: '#2196F3', // Cor de fundo
    },
  },
});

export default theme;