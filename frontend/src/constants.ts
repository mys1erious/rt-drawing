export const FPS = 60;
// export const FPS = 144;
export const FRAME_INTERVAL = 1000/FPS;


export const OUT_OF_BOUNDS_VALUE = -1;
export const DEFAULT_DRAW_COLOR = '#000000';
export const DEFAULT_DRAW_SIZE = 3;

export const ACTIONS = {
    DRAWING: 'drawing',
    START_DRAWING: 'start_drawing',
    STOP_DRAWING: 'stop_drawing'
} as const;
export type ACTIONS_TYPE = typeof ACTIONS[keyof typeof ACTIONS];
