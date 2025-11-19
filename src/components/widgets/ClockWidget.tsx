import { useState, useEffect } from "react";
import { Box, Typography, Stack, FormControlLabel, Switch } from "@mui/material";

export const ClockWidget = ({ format24, showSeconds, color }: { format24: boolean, showSeconds: boolean, color: string }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const format = (date: Date) => {
        let h = date.getHours();
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        let ampm = '';

        if (!format24) {
            ampm = h >= 12 ? ' PM' : ' AM';
            h = h % 12;
            h = h ? h : 12;
        }

        const hStr = h.toString().padStart(2, '0');
        return `${hStr}:${m}${showSeconds ? `:${s}` : ''}${ampm}`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: color, userSelect: 'none' }}>
            <Typography variant="h3" sx={{ fontWeight: 300, letterSpacing: -2 }}>
                {format(time)}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.7, letterSpacing: 2, textTransform: 'uppercase' }}>
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
        </Box>
    );
};

export const ClockConfig = ({ config, onChange }: { config: any, onChange: (c: any) => void }) => (
    <Stack spacing={3}>
        <Box>
            <FormControlLabel
                control={<Switch checked={config.format24} onChange={e => onChange({ ...config, format24: e.target.checked })} />}
                label="24 Hour Format"
            />
            <FormControlLabel
                control={<Switch checked={config.showSeconds} onChange={e => onChange({ ...config, showSeconds: e.target.checked })} />}
                label="Show Seconds"
            />
        </Box>
        <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Text Color</Typography>
            <Stack direction="row" spacing={1}>
                {['#333333', '#1976d2', '#e91e63', '#2e7d32', '#ff9800'].map(c => (
                    <Box
                        key={c}
                        onClick={() => onChange({ ...config, color: c })}
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: c,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: config.color === c ? '2px solid #fff' : '1px solid transparent',
                            boxShadow: config.color === c ? '0 0 0 2px #2196f3' : 'none',
                            transition: 'all 0.2s'
                        }}
                    />
                ))}
            </Stack>
        </Box>
    </Stack>
);
