
import { createTheme } from "@mui/material/styles";

// Tribe Design System
const colors = {
  navy: "#071739",
  navyHover: "#123C62",
  blue: "#4B6382",
  mutedBlue: "#A4B5C4",
  border: "#D6E0ED",
  brown: "#A68868",
  beige: "#E3C39D",
  canvas: "#F3F7FC",
  white: "#FFFFFF",
};

const tribeTheme = createTheme({
  direction: "rtl",

  palette: {
    mode: "light",

    primary: {
      main: colors.navy,
      light: colors.blue,
      dark: "#050F26",
      contrastText: colors.white,
    },

    secondary: {
      main: colors.brown,
      light: colors.beige,
      dark: "#786045",
      contrastText: colors.white,
    },

    background: {
      default: colors.canvas,
      paper: colors.white,
    },

    text: {
      primary: colors.navy,
      secondary: colors.blue,
    },

    divider: colors.border,
    error: { main: "#B42318" },
    success: { main: "#14866D" },
  },

  typography: {
    
    fontFamily: '"Vazirmatn", "Segoe UI", Arial, sans-serif',

    h4: {
      fontWeight: 750,
      letterSpacing: "-0.8px",
    },

    h5: {
      fontWeight: 750,
      letterSpacing: "-0.6px",
    },

    h6: {
      fontWeight: 700,
      letterSpacing: "-0.3px",
    },

    subtitle1: {
      fontWeight: 600,
    },

    button: {
      fontWeight: 650,
      textTransform: "none",
      letterSpacing: 0,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.canvas,
          color: colors.navy,
          WebkitFontSmoothing: "antialiased",
        },
      },
    },

    // Modern buttons
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 12,
          padding: "9px 20px",
          boxShadow: "none",
          textTransform: "none",
          transition:
            "background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",

          "&:hover": {
            boxShadow: "none",
          },
        },

        containedPrimary: {
          background:
            "linear-gradient(135deg, #164E7C 0%, #071739 100%)",
          boxShadow: "0 5px 15px rgba(7, 23, 57, 0.13)",

          "&:hover": {
            background:
              "linear-gradient(135deg, #215D90 0%, #102B50 100%)",
            boxShadow: "0 7px 18px rgba(7, 23, 57, 0.17)",
          },
        },

        containedSecondary: {
          backgroundColor: colors.brown,

          "&:hover": {
            backgroundColor: "#937253",
          },
        },

        outlined: {
          borderColor: colors.border,

          "&:hover": {
            borderColor: colors.mutedBlue,
            backgroundColor: "#F5F8FD",
          },
        },
      },
    },

    // Project cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          backgroundImage: "none",
          boxShadow:
            "0 9px 28px rgba(24, 53, 88, 0.055)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },

    // Form fields
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FBFCFF",
          transition:
            "background-color 180ms ease, box-shadow 180ms ease",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.border,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.mutedBlue,
          },

          "&.Mui-focused": {
            backgroundColor: colors.white,
            boxShadow:
              "0 0 0 3px rgba(75, 99, 130, 0.10)",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.blue,
            borderWidth: 1.5,
          },
        },

        input: {
          padding: "13px 15px",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.blue,
          fontWeight: 500,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          fontWeight: 600,
        },
      },
    },

    // Create Project modal
    // Scoped to avoid changing other dialogs.
    MuiDialog: {
      styleOverrides: {
        root: {
          "&.tribe-create-project-dialog .MuiBackdrop-root": {
            backgroundColor: "rgba(10, 25, 49, 0.58)",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
          },

          "&.tribe-create-project-dialog .MuiDialog-paper": {
            width: "min(860px, calc(100% - 24px))",
            maxWidth: "none",
            maxHeight: "min(90vh, 850px)",
            margin: 12,
            borderRadius: 26,
            overflow: "hidden",
            border:
              "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow:
              "0 28px 90px rgba(4, 18, 42, 0.28)",
            backgroundColor: colors.white,
          },

          "@media (max-width: 600px)": {
            "&.tribe-create-project-dialog .MuiDialog-paper": {
              borderRadius: 18,
              maxHeight: "calc(100dvh - 24px)",
            },
          },
        },
      },
    },
  },
});

export default tribeTheme;
