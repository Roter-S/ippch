import { createTheme } from '@mui/material/styles';
import { blue, pink, red, lightBlue, yellow, teal } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[600],
    },
    secondary: {
      main: pink[600],
    },
    error: {
      main: red[500],
    },
    warning: {
      main: yellow[500],
    },
    info: {
      main: lightBlue[300],
    },
    success: {
      main: teal[400],
    },
    background: {
      default: '#080F25',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#101935',
          borderRadius: '15px',
          border: '1px solid #232E4F',
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#101935',
          boxShadow: 'none',
        }
      }
    }
  },
});

export default theme;
