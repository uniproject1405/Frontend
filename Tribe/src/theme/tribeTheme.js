
import { createTheme } from "@mui/material/styles";

const tribeTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#071739",
      light: "#4B6382",
      dark: "#050F26",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#A68868",
      light: "#E3C39D",
      dark: "#786045",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F5F8FA",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#071739",
      secondary: "#4B6382",
    },

    divider: "#CDD5DB",

    error: {
      main: "#B42318",
    },
  },

  typography: {
    fontFamily: '"Vazirmatn", "Segoe UI", Arial, sans-serif',

    h4: {
      fontWeight: 700,
      letterSpacing: "-0.8px",
    },

    h5: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  
  shape: {
    borderRadius: 8,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          padding: "10px 20px",
          boxShadow: "none",
          textTransform: "none",

          "&:hover": {
            boxShadow: "none",
          },
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius * 2,
          border: "1px solid #CDD5DB",
          boxShadow: "0 8px 32px rgba(7, 23, 57, 0.05)",
        }),
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          backgroundColor: "#FFFFFF",
        }),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
  },

});

export default tribeTheme;
