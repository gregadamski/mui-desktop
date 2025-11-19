
import { AccessTime, Note, Public, BarChart } from "@mui/icons-material";
import { ComponentDefinition } from '../types';
import { ClockWidget, ClockConfig } from '../components/widgets/ClockWidget';
import { NoteWidget, NoteConfig } from '../components/widgets/NoteWidget';
import { BrowserWidget, BrowserConfig } from '../components/widgets/BrowserWidget';
import { ChartWidget, ChartConfig } from '../components/widgets/ChartWidget';

export const REGISTRY: Record<string, ComponentDefinition> = {
    clock: {
        id: 'clock',
        name: 'Clock',
        icon: <AccessTime />,
        component: ClockWidget,
        configComponent: ClockConfig,
        defaultSize: { w: 300, h: 180 },
        defaultConfig: {
            format24: false,
            showSeconds: true,
            color: '#1976d2'
        }
    },
    notepad: {
        id: 'notepad',
        name: 'Notes',
        icon: <Note />,
        component: NoteWidget,
        configComponent: NoteConfig,
        defaultSize: { w: 280, h: 320 },
        defaultConfig: {
            backgroundColor: '#fff9c4',
            fontSize: 16,
            text: ''
        }
    },
    browser: {
        id: 'browser',
        name: 'Web',
        icon: <Public />,
        component: BrowserWidget,
        configComponent: BrowserConfig,
        defaultSize: { w: 600, h: 450 },
        defaultConfig: {
            url: 'https://www.wikipedia.org'
        }
    },
    stats: {
        id: 'stats',
        name: 'Stats',
        icon: <BarChart />,
        component: ChartWidget,
        configComponent: ChartConfig,
        defaultSize: { w: 400, h: 300 },
        defaultConfig: {
            type: 'bar'
        }
    }
};
