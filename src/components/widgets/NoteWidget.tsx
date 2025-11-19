import { useState } from "react";
import { Box, Typography, Stack, Slider, InputBase } from "@mui/material";

export const NoteWidget = ({ backgroundColor, fontSize, text }: { backgroundColor: string, fontSize: number, text: string }) => {
    const [content, setContent] = useState(text || "");
    return (
        <InputBase
            multiline
            fullWidth
            sx={{
                height: '100%',
                p: 2,
                bgcolor: backgroundColor,
                fontSize: fontSize,
                alignItems: 'flex-start',
                color: 'text.primary'
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your notes here..."
        />
    );
};

export const NoteConfig = ({ config, onChange }: { config: any, onChange: (c: any) => void }) => (
    <Stack spacing={3}>
        <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Background</Typography>
            <Stack direction="row" spacing={1}>
                {['#fff9c4', '#bbdefb', '#c8e6c9', '#f8bbd0', '#ffffff'].map(c => (
                    <Box
                        key={c}
                        onClick={() => onChange({ ...config, backgroundColor: c })}
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: c,
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: config.backgroundColor === c ? '0 0 0 2px #2196f3' : 'none'
                        }}
                    />
                ))}
            </Stack>
        </Box>
        <Box>
            <Typography id="font-size-slider" variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                Font Size: {config.fontSize}px
            </Typography>
            <Slider
                size="small"
                value={config.fontSize}
                min={12}
                max={32}
                step={2}
                onChange={(_, v) => onChange({ ...config, fontSize: v as number })}
                aria-labelledby="font-size-slider"
            />
        </Box>
    </Stack>
);
