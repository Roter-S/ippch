import { createTheme } from '@mui/material/styles';
import { blue, pink, red, lightBlue, yellow, teal } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[600],
      light: blue[300],
      dark: blue[900],
    },
    secondary: {
      main: pink[600],
      light: pink[300],
      dark: pink[900],
    },
    error: {
      main: red[500],
      light: red[300],
      dark: red[900],
    },
    warning: {
      main: yellow[500],
      light: yellow[300],
      dark: yellow[900],
    },
    info: {
      main: lightBlue[300],
      light: lightBlue[100],
      dark: lightBlue[700],
    },
    success: {
      main: teal[400],
      light: teal[200],
      dark: teal[800],
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
          borderRadius: '10px',
          border: '1px solid #232E4F',
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(16, 25, 53, 0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)",
          borderRadius: "10px",
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#101935',
          backdropFilter: "blur(10px)",
          boxShadow: 'none',
        }
      }
    }
  },
});

export default theme;
