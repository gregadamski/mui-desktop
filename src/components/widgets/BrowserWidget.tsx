import React, { useState, useEffect } from "react";
import { Box, Paper, InputBase, IconButton, TextField } from "@mui/material";
import { Launch } from "@mui/icons-material";

export const BrowserWidget = ({ url }: { url: string }) => {
    const [currentUrl, setCurrentUrl] = useState(url);
    const [inputUrl, setInputUrl] = useState(url);

    useEffect(() => { setCurrentUrl(url); setInputUrl(url); }, [url]);

    const go = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentUrl(inputUrl);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff' }}>
            <Paper
                component="form"
                onSubmit={go}
                elevation={0}
                square
                sx={{ p: 1, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                    placeholder="Enter URL"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                />
                <IconButton type="submit" size="small" sx={{ p: '5px' }}>
                    <Launch fontSize="small" />
                </IconButton>
            </Paper>
            <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <iframe
                    src={currentUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="browser"
                    sandbox="allow-scripts allow-same-origin"
                />
                <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            </Box>
        </Box>
    );
}

export const BrowserConfig = ({ config, onChange }: { config: any, onChange: (c: any) => void }) => (
    <Box>
        <TextField
            label="Default URL"
            fullWidth
            variant="outlined"
            size="small"
            value={config.url}
            onChange={(e) => onChange({ ...config, url: e.target.value })}
            helperText="Sets the starting URL for this window"
        />
    </Box>
);
