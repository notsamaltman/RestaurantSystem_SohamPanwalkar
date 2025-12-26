import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#08090a",
      paper: "#0f1115",
    },
    text: {
      primary: "#ffffff",
      secondary: "#9ca3af",
    },
  },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#0f1115",
          color: "#ffffff",
        },
        notchedOutline: {
          borderColor: "#1f2933",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#374151",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#60a5fa",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#9ca3af",
          "&.Mui-focused": {
            color: "#60a5fa",
          },
        },
      },
    },

    MuiPickersPopper: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0f1115",
          color: "#ffffff",
          border: "1px solid #1f2933",
        },
      },
    },

    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#1f2933",
          },
          "&.Mui-selected": {
            backgroundColor: "#2563eb",
          },
        },
      },
    },

    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          color: "#ffffff",
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#9ca3af",
        },
      },
    },
  },
});
