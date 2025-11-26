import { useState, forwardRef, useImperativeHandle } from "react";
import { ThemeProvider, CssBaseline, Box, Typography } from "@mui/material";
import { theme } from "../../theme";
import { WindowInstance, ComponentDefinition } from "../../types";
import { WindowFrame } from "./WindowFrame";
import { Taskbar } from "./Taskbar";

export interface DesktopState {
    windows: WindowInstance[];
    activeWindowId: string | null;
    currentDesktop: number;
    desktopCount: number;
    nextZIndex: number;
}

export interface DesktopHandle {
    getState: () => DesktopState;
    loadConfig: (state: DesktopState) => void;
}

interface DesktopProps {
    registry: Record<string, ComponentDefinition>;
}

export const Desktop = forwardRef<DesktopHandle, DesktopProps>(({ registry }, ref) => {
    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [currentDesktop, setCurrentDesktop] = useState(0);
    const [desktopCount, setDesktopCount] = useState(3);
    const [nextZIndex, setNextZIndex] = useState(100);

    useImperativeHandle(ref, () => ({
        getState: () => ({
            windows,
            activeWindowId,
            currentDesktop,
            desktopCount,
            nextZIndex
        }),
        loadConfig: (state: DesktopState) => {
            setWindows(state.windows);
            setActiveWindowId(state.activeWindowId);
            setCurrentDesktop(state.currentDesktop);
            setDesktopCount(state.desktopCount);
            setNextZIndex(state.nextZIndex);
        }
    }));

    const addDesktop = () => setDesktopCount(c => c + 1);

    const removeDesktop = () => {
        if (desktopCount <= 1) return;

        const newCount = desktopCount - 1;

        // Move windows from removed desktop to the last available one (newCount - 1)
        setWindows(ws => ws.map(w => {
            if (w.desktopId >= newCount) {
                return { ...w, desktopId: newCount - 1 };
            }
            return w;
        }));

        if (currentDesktop >= newCount) {
            setCurrentDesktop(newCount - 1);
        }

        setDesktopCount(newCount);
    };

    const addWindow = (componentId: string) => {
        const def = registry[componentId];
        const newWindow: WindowInstance = {
            id: `win_${Date.now()}`,
            componentId,
            title: def.name,
            x: 50 + (windows.filter(w => w.desktopId === currentDesktop).length * 40),
            y: 50 + (windows.filter(w => w.desktopId === currentDesktop).length * 40),
            w: def.defaultSize.w,
            h: def.defaultSize.h,
            zIndex: nextZIndex,
            desktopId: currentDesktop,
            isMinimized: false,
            isMaximized: false,
            configValues: { ...def.defaultConfig }
        };
        setWindows([...windows, newWindow]);
        setNextZIndex(prev => prev + 1);
        setActiveWindowId(newWindow.id);
    };

    const closeWindow = (id: string) => setWindows(ws => ws.filter(w => w.id !== id));

    const focusWindow = (id: string) => {
        setActiveWindowId(id);
        setWindows(ws => ws.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
        setNextZIndex(prev => prev + 1);
    };

    const toggleMinimize = (id: string) => {
        setWindows(ws => ws.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    };

    const toggleMaximize = (id: string) => {
        setWindows(ws => ws.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
        focusWindow(id);
    };

    const updateWindowConfig = (id: string, newConfig: Record<string, any>) => {
        setWindows(ws => ws.map(w => w.id === id ? { ...w, configValues: { ...w.configValues, ...newConfig } } : w));
    };

    const updateWindowGeometry = (id: string, geo: Partial<{ x: number, y: number, w: number, h: number }>) => {
        setWindows(ws => ws.map(w => w.id === id ? { ...w, ...geo } : w));
    };

    const currentDesktopWindows = windows.filter(w => w.desktopId === currentDesktop);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'radial-gradient(circle at 50% 0%, #4527a0 0%, #283593 40%, #0d47a1 100%)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px',
                        opacity: 0.1,
                        pointerEvents: 'none'
                    }
                }}
            >
                {/* Desktop Number Watermark */}
                <Typography
                    variant="h1"
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        right: '10%',
                        fontWeight: 900,
                        fontSize: '15rem',
                        color: 'rgba(255,255,255,0.03)',
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}
                >
                    {currentDesktop + 1}
                </Typography>

                {currentDesktopWindows.map(win => (
                    <WindowFrame
                        key={win.id}
                        window={win}
                        registry={registry}
                        isActive={activeWindowId === win.id}
                        onClose={() => closeWindow(win.id)}
                        onFocus={() => focusWindow(win.id)}
                        onMinimize={() => toggleMinimize(win.id)}
                        onMaximize={() => toggleMaximize(win.id)}
                        onUpdateConfig={(cfg) => updateWindowConfig(win.id, cfg)}
                        onUpdateGeometry={(geo) => updateWindowGeometry(win.id, geo)}
                    />
                ))}

                <Taskbar
                    windows={currentDesktopWindows}
                    registry={registry}
                    activeWindowId={activeWindowId}
                    onWindowClick={(id: string) => {
                        const w = windows.find(x => x.id === id);
                        if (w?.isMinimized) toggleMinimize(id);
                        focusWindow(id);
                    }}
                    onLaunch={addWindow}
                    currentDesktop={currentDesktop}
                    onSwitchDesktop={setCurrentDesktop}
                    desktopCount={desktopCount}
                    onAddDesktop={addDesktop}
                    onRemoveDesktop={removeDesktop}
                />
            </Box>
        </ThemeProvider>
    );
});
