import { Box, Typography, Select, MenuItem } from "@mui/material";

export const ChartWidget = ({ type }: { type: string }) => {
    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #263238 0%, #37474f 100%)',
            color: 'white'
        }}>
            <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>System Load</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 150 }}>
                {[40, 70, 35, 60, 90, 50, 80].map((h, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 16,
                            height: `${h}%`,
                            bgcolor: type === 'bar' ? '#2196f3' : '#ab47bc',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.5s ease'
                        }}
                    />
                ))}
            </Box>
            <Typography variant="caption" sx={{ mt: 2, opacity: 0.6, fontFamily: 'monospace' }}>
                NODE: ALPHA-01
            </Typography>
        </Box>
    )
}

export const ChartConfig = ({ config, onChange }: { config: any, onChange: (c: any) => void }) => (
    <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Chart Type</Typography>
        <Select
            fullWidth
            size="small"
            value={config.type}
            onChange={(e) => onChange({ ...config, type: e.target.value })}
        >
            <MenuItem value="bar">Blue Bars</MenuItem>
            <MenuItem value="column">Purple Columns</MenuItem>
        </Select>
    </Box>
);
