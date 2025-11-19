import React from 'react';

export type ComponentDefinition = {
    id: string;
    name: string;
    icon: React.ReactNode;
    component: React.FC<any>;
    configComponent?: React.FC<{ config: any; onChange: (newConfig: any) => void }>;
    defaultSize: { w: number; h: number };
    defaultConfig: Record<string, any>;
};

export type WindowInstance = {
    id: string;
    componentId: string;
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
    zIndex: number;
    desktopId: number;
    isMinimized: boolean;
    isMaximized: boolean;
    configValues: Record<string, any>;
};
