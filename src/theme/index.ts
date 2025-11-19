import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#e91e63',
        },
        background: {
            paper: 'rgba(255, 255, 255, 0.75)',
        }
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(16px)',
                    backgroundImage: 'none',
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }
            }
        }
    }
});
