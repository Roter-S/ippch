import { createTheme } from '@mui/material/styles'
import { blue, pink, red, lightBlue, yellow, teal, deepPurple } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface Palette {
    ochre: Palette['primary']
    violet: Palette['primary']
  }

  interface PaletteOptions {
    ochre?: PaletteOptions['primary']
    violet?: PaletteOptions['primary']
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[600],
      light: blue[300],
      dark: blue[900]
    },
    secondary: {
      main: pink[600],
      light: pink[300],
      dark: pink[900]
    },
    error: {
      main: red[500],
      light: red[300],
      dark: red[900]
    },
    warning: {
      main: yellow[500],
      light: yellow[300],
      dark: yellow[900]
    },
    info: {
      main: lightBlue[300],
      light: lightBlue[100],
      dark: lightBlue[900]
    },
    success: {
      main: teal[500],
      light: teal[300],
      dark: teal[900]
    },
    ochre: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105'
    },
    violet: {
      main: deepPurple[500],
      light: deepPurple[200],
      dark: deepPurple[900]
    },
    grey: {
      50: '#F9FAFB',
      100: '#F4F6F8',
      200: '#DFE3E8',
      300: '#C4CDD5',
      400: '#919EAB',
      500: '#637381',
      600: '#454F5B',
      700: '#212B36',
      800: '#161C24',
      900: '#0D1117'
    },
    background: {
      default: '#080F25'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '4px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#101935',
          borderRadius: '10px',
          border: '1px solid #232E4F',
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: '#fff',
          padding: '24px'
        },
        title: {
          fontSize: '1.125rem'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(16, 25, 53, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
          borderRadius: '10px'
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          background: '#101935',
          boxShadow: 'none'
        },
        rounded: {
          borderRadius: '10px'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(16, 25, 53, 0.7)',
          backdropFilter: 'blur(10px)'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          transition: 'color 0.2s ease-in-out',
          ':hover': {
            color: blue[900]
          }
        }
      }
    }
  }
})

export default theme
