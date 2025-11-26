import { useState } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Menu,
    Typography,
    MenuItem,
    Button,
    Stack,
    Tooltip,
    Divider
} from '@mui/material';
import {
    Add,
    DesktopWindows
} from '@mui/icons-material';
import { WindowInstance, ComponentDefinition } from '../../types';

export const Taskbar = ({
    windows,
    registry,
    activeWindowId,
    onWindowClick,
    onLaunch,
    currentDesktop,
    onSwitchDesktop,
    desktopCount,
    onAddDesktop,
    onRemoveDesktop
}: {
    windows: WindowInstance[];
    registry: Record<string, ComponentDefinition>;
    activeWindowId: string | null;
    onWindowClick: (id: string) => void;
    onLaunch: (id: string) => void;
    currentDesktop: number;
    onSwitchDesktop: (id: number) => void;
    desktopCount: number;
    onAddDesktop: () => void;
    onRemoveDesktop: () => void;
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200
        }}>
            <Paper
                sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid rgba(255,255,255,0.3)'
                }}
                elevation={6}
            >
                {/* Start Button */}
                <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        bgcolor: open ? 'primary.main' : 'white',
                        color: open ? 'white' : 'primary.main',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' },
                        boxShadow: 2
                    }}
                >
                    <Add />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    PaperProps={{ sx: { mb: 2, borderRadius: 3, minWidth: 200 } }}
                >
                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="overline" color="text.secondary">Add to Desktop {currentDesktop + 1}</Typography>
                    </Box>
                    {Object.values(registry).map((def: ComponentDefinition) => (
                        <MenuItem key={def.id} onClick={() => { onLaunch(def.id); setAnchorEl(null); }}>
                            <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}>{def.icon}</Box>
                            <Typography>{def.name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>

                {/* Desktop Switcher */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        bgcolor: 'rgba(0,0,0,0.05)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        alignItems: 'center'
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={onRemoveDesktop}
                        disabled={desktopCount <= 1}
                        sx={{ borderRadius: 0, width: 24, height: '100%' }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>-</Typography>
                    </IconButton>

                    {Array.from({ length: desktopCount }).map((_, i) => (
                        <Button
                            key={i}
                            onClick={() => onSwitchDesktop(i)}
                            variant={currentDesktop === i ? "contained" : "text"}
                            color={currentDesktop === i ? "primary" : "inherit"}
                            sx={{
                                minWidth: 36,
                                px: 1,
                                borderRadius: 0,
                                opacity: currentDesktop === i ? 1 : 0.6
                            }}
                        >
                            <Stack spacing={0} sx={{ alignItems: 'center' }}>
                                <DesktopWindows fontSize="small" />
                                <Typography variant="caption" sx={{ fontSize: '0.6rem', lineHeight: 1 }}>{i + 1}</Typography>
                            </Stack>
                        </Button>
                    ))}

                    <IconButton
                        size="small"
                        onClick={onAddDesktop}
                        sx={{ borderRadius: 0, width: 24, height: '100%' }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>+</Typography>
                    </IconButton>
                </Paper>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                {/* Running Apps */}
                <Stack direction="row" spacing={1}>
                    {windows.length === 0 && (
                        <Typography variant="caption" sx={{ color: 'text.disabled', py: 1 }}>Empty</Typography>
                    )}
                    {windows.map((w: WindowInstance) => {
                        const isActive = activeWindowId === w.id && !w.isMinimized;
                        return (
                            <Tooltip key={w.id} title={w.title} arrow placement="top">
                                <IconButton
                                    onClick={() => onWindowClick(w.id)}
                                    sx={{
                                        bgcolor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                                        border: isActive ? '1px solid #2196f3' : '1px solid transparent',
                                        borderRadius: 3,
                                        transition: 'all 0.2s',
                                        opacity: w.isMinimized ? 0.6 : 1,
                                        filter: w.isMinimized ? 'grayscale(100%)' : 'none'
                                    }}
                                >
                                    {registry[w.componentId].icon}
                                    {/* Indicator */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 2,
                                        width: 4,
                                        height: 4,
                                        borderRadius: '50%',
                                        bgcolor: 'text.primary',
                                        opacity: w.isMinimized ? 0 : 1
                                    }} />
                                </IconButton>
                            </Tooltip>
                        );
                    })}
                </Stack>
            </Paper>
        </Box>
    );
};

