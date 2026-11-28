
import { createTheme } from "@mui/material/styles";

const tribeTheme = createTheme({
  direction: "rtl",
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
    // Flex gap is direction-neutral; margin-based spacing lands on the wrong side
    // when a Stack sits inside an LTR box (the RTL plugin flips the margins).
    MuiStack: { defaultProps: { useFlexGap: true } },
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
        // Logical margins follow the text direction, so the icon never glues to the label.
        startIcon: { marginLeft: 0, marginRight: 0, marginInlineStart: -4, marginInlineEnd: 8 },
        endIcon: { marginLeft: 0, marginRight: 0, marginInlineStart: 8, marginInlineEnd: -4 },
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
