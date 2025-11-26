import { useRef } from "react";
import { Desktop, DesktopHandle, DesktopState } from "./components/system/Desktop";
import { REGISTRY } from "./config/registry";
import { Box, Button } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';

const App = () => {
    const desktopRef = useRef<DesktopHandle>(null);

    const handleSave = () => {
        if (desktopRef.current) {
            const state = desktopRef.current.getState();
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `desktop-layout-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && desktopRef.current) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const state = JSON.parse(e.target?.result as string) as DesktopState;
                    desktopRef.current?.loadConfig(state);
                } catch (error) {
                    console.error("Failed to parse layout file", error);
                    alert("Invalid layout file");
                }
            };
            reader.readAsText(file);
        }
        // Reset input so same file can be selected again
        event.target.value = '';
    };

    return (
        <>
            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2000, display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                >
                    Save Layout
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                >
                    Load Layout
                    <input
                        type="file"
                        hidden
                        accept=".json"
                        onChange={handleLoad}
                    />
                </Button>
            </Box>
            <Desktop ref={desktopRef} registry={REGISTRY} />
        </>
    );
};

export default App;
