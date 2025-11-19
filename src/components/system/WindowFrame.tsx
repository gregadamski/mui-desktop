import React, { useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import {
    Settings,
    Remove,
    CropSquare,
    Close,
    OpenWith
} from '@mui/icons-material';
import { WindowInstance, ComponentDefinition } from '../../types';

export const WindowFrame = ({
    window,
    registry,
    isActive,
    onClose,
    onFocus,
    onMinimize,
    onMaximize,
    onUpdateConfig,
    onUpdateGeometry
}: {
    window: WindowInstance;
    registry: Record<string, ComponentDefinition>;
    isActive: boolean;
    onClose: () => void;
    onFocus: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onUpdateConfig: (cfg: any) => void;
    onUpdateGeometry: (geo: any) => void;
}) => {
    const [showSettings, setShowSettings] = useState(false);
    const [tempConfig, setTempConfig] = useState<any>(null);
    const def = registry[window.componentId];
    const Component = def.component;
    const ConfigComponent = def.configComponent;

    const handleOpenSettings = () => {
        setTempConfig({ ...window.configValues });
        setShowSettings(true);
    };

    const handleSaveSettings = () => {
        onUpdateConfig(tempConfig);
        setShowSettings(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (window.isMaximized) return;
        if ((e.target as HTMLElement).closest('.no-drag')) return;

        onFocus();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = window.x;
        const startTop = window.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            onUpdateGeometry({ x: startLeft + dx, y: startTop + dy });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleResizeDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = window.w;
        const startH = window.h;

        const handleResizeMove = (moveEvent: MouseEvent) => {
            const w = Math.max(200, startW + (moveEvent.clientX - startX));
            const h = Math.max(150, startH + (moveEvent.clientY - startY));
            onUpdateGeometry({ w, h });
        };

        const handleResizeUp = () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeUp);
        };

        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeUp);
    };

    if (window.isMinimized) return null;

    return (
        <>
            <Paper
                elevation={isActive ? 12 : 4}
                sx={{
                    position: window.isMaximized ? 'fixed' : 'absolute',
                    top: window.isMaximized ? 0 : undefined,
                    left: window.isMaximized ? 0 : undefined,
                    right: window.isMaximized ? 0 : undefined,
                    bottom: window.isMaximized ? 80 : undefined,
                    transform: window.isMaximized ? 'none' : `translate(${window.x}px, ${window.y}px)`,
                    width: window.isMaximized ? 'auto' : window.w,
                    height: window.isMaximized ? 'auto' : window.h,
                    zIndex: window.zIndex,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s, width 0.05s, height 0.05s',
                    border: isActive ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.2)',
                }}
                onMouseDown={() => !isActive && onFocus()}
            >
                {/* Title Bar */}
                <Box
                    sx={{
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1,
                        bgcolor: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        cursor: window.isMaximized ? 'default' : 'move',
                        userSelect: 'none'
                    }}
                    onMouseDown={handleMouseDown}
                    onDoubleClick={onMaximize}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                        <Box sx={{ color: 'primary.main', display: 'flex' }}>{def.icon}</Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>{window.title}</Typography>
                    </Box>

                    <Box className="no-drag" sx={{ display: 'flex', gap: 0.5 }}>
                        {ConfigComponent && (
                            <IconButton size="small" onClick={handleOpenSettings}>
                                <Settings fontSize="small" />
                            </IconButton>
                        )}
                        <IconButton size="small" onClick={onMinimize}>
                            <Remove fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onMaximize}>
                            <CropSquare fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={onClose} color="error">
                            <Close fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.4)' }}>
                    <Component {...window.configValues} />
                </Box>

                {/* Resize Handle */}
                {!window.isMaximized && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 20,
                            height: 20,
                            cursor: 'nwse-resize',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            opacity: 0.5,
                            '&:hover': { opacity: 1 }
                        }}
                        onMouseDown={handleResizeDown}
                    >
                        <OpenWith fontSize="inherit" sx={{ transform: 'rotate(45deg)' }} />
                    </Box>
                )}
            </Paper>

            {/* Settings Dialog */}
            {ConfigComponent && (
                <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ pb: 1 }}>{window.title} Settings</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pt: 3 }}>
                        {tempConfig && (
                            <ConfigComponent
                                config={tempConfig}
                                onChange={(newConfig: any) => setTempConfig(newConfig)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowSettings(false)}>Cancel</Button>
                        <Button onClick={handleSaveSettings} variant="contained">Apply</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

