import { createTheme } from "@mui/material/styles";

export const muiDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ADB5",
      dark: "#00949B",
      contrastText: "#111827",
    },
    secondary: {
      main: "#38BDF8",
      contrastText: "#111827",
    },
    background: {
      default: "#111827",
      paper: "#1F2937",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
    },
    divider: "#374151",
    error: {
      main: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#FBBF24",
    },
    success: {
      main: "#22C55E",
    },
    info: {
      main: "#38BDF8",
    },
  },
  typography: {
    fontFamily: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"].join(","),
    h1: { color: "#F8FAFC", fontWeight: 700 },
    h2: { color: "#F8FAFC", fontWeight: 700 },
    h3: { color: "#F8FAFC", fontWeight: 600 },
    h4: { color: "#F8FAFC", fontWeight: 600 },
    h5: { color: "#F8FAFC", fontWeight: 600 },
    h6: { color: "#F8FAFC", fontWeight: 600 },
    body1: { color: "#CBD5E1" },
    body2: { color: "#94A3B8" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1F2937",
          color: "#F8FAFC",
          borderColor: "#374151",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1F2937",
          border: "1px solid #374151",
          borderRadius: "16px",
          color: "#F8FAFC",
          backgroundImage: "none",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#F8FAFC",
          fontWeight: 700,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "#CBD5E1",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#00ADB5",
          color: "#111827",
          "&:hover": {
            backgroundColor: "#00949B",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#1F2937",
          border: "1px solid #374151",
          color: "#F8FAFC",
        },
        standardSuccess: {
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          borderColor: "rgba(34, 197, 94, 0.3)",
          color: "#86EFAC",
        },
        standardError: {
          backgroundColor: "rgba(248, 113, 113, 0.12)",
          borderColor: "rgba(248, 113, 113, 0.3)",
          color: "#FCA5A5",
        },
        standardWarning: {
          backgroundColor: "rgba(251, 191, 36, 0.12)",
          borderColor: "rgba(251, 191, 36, 0.3)",
          color: "#FDE68A",
        },
        standardInfo: {
          backgroundColor: "rgba(0, 173, 181, 0.12)",
          borderColor: "rgba(0, 173, 181, 0.3)",
          color: "#67E8F9",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#293548",
          border: "1px solid #374151",
          color: "#F8FAFC",
          backgroundImage: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#CBD5E1",
          "&:hover": {
            backgroundColor: "#1F2937",
            color: "#F8FAFC",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 173, 181, 0.18)",
            color: "#00ADB5",
            fontWeight: 600,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#1F2937",
          borderRadius: "10px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#374151",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00ADB5",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00ADB5",
          },
        },
        input: {
          color: "#F8FAFC",
        },
      },
    },
  },
});
