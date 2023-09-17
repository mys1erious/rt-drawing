'use client';

import {useEffect, useRef} from "react";

import {
    DEFAULT_DRAW_COLOR,
    DEFAULT_DRAW_SIZE,
    OUT_OF_BOUNDS_VALUE,
    FRAME_INTERVAL, ACTIONS, ACTIONS_TYPE,

} from "@/constants";
import {onCloseSocket, onOpenSocket} from "@/utils";


type CanvasProps = {
    roomName?: string
};


type DrawingData = {
    x: number,
    y: number,
    color: string,
    size: number,
};


type WSActionData = {
    action: ACTIONS_TYPE,
    data: object
};


type WSActionDrawingData = {
    action: ACTIONS_TYPE,
    data: DrawingData
};


type lastPosition = {
    x: number,
    y: number
};


// TODO: the data should be user-related and the room should hold all of the users
//  so that it doesnt interfere with each other's drawing
const Canvas = ({roomName}: CanvasProps) => {
    const frameTimerRef = useRef(0);
    const lastTimeRef = useRef(0);

    const webSocketRef = useRef<WebSocket | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef(false);
    const shouldSendDataRef = useRef(false);
    const currentDrawingDataRef = useRef<DrawingData>({
        x: OUT_OF_BOUNDS_VALUE,
        y: OUT_OF_BOUNDS_VALUE,
        color: DEFAULT_DRAW_COLOR,
        size: DEFAULT_DRAW_SIZE,
    });
    const lastPositionRef = useRef<lastPosition>({
        x: OUT_OF_BOUNDS_VALUE,
        y: OUT_OF_BOUNDS_VALUE
    });

    useEffect(() => {
        webSocketRef.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_BASE_SOCKET_URL}/ws/drawing/${roomName}/`
        );
        const ws = webSocketRef.current;

        ws.onopen = onOpenSocket;
        ws.onmessage = onMessageSocket;
        ws.onclose = onCloseSocket;

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.addEventListener('mousedown', onStartDrawing);
        canvas.addEventListener('mouseup', onStopDrawing);
        canvas.addEventListener('mouseleave', onStopDrawing);
        canvas.addEventListener('mousemove', onDrawing);

        animate(0);
        return () => {
            canvas.removeEventListener('mousedown', onStartDrawing);
            canvas.removeEventListener('mouseup', onStopDrawing);
            canvas.removeEventListener('mouseleave', onStopDrawing);
            canvas.removeEventListener('mousemove', onDrawing);
            ws.close();
        };
    }, []);

    const onMessageSocket = (e: MessageEvent) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const data = JSON.parse(e.data);
        const action = data.action;

        switch (action) {
            case ACTIONS.DRAWING:
                drawLine(ctx, data.data.x, data.data.y, data.data.color, data.data.size);
                break;
            case ACTIONS.START_DRAWING:
                lastPositionRef.current.x = data.data.last_position_x;
                lastPositionRef.current.y = data.data.last_position_y;
                ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
                isDrawingRef.current = data.data.is_drawing;
                break;
            case ACTIONS.STOP_DRAWING:
                lastPositionRef.current.x = OUT_OF_BOUNDS_VALUE;
                lastPositionRef.current.y = OUT_OF_BOUNDS_VALUE;
                isDrawingRef.current = data.data.is_drawing;
                break;
            default:
                console.log('Unexpected action received: ', action);
        }
    };

    const onStartDrawing = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const lastPositionX = e.clientX - canvas.getBoundingClientRect().left;
        const lastPositionY = e.clientY - canvas.getBoundingClientRect().top;

        if (!webSocketRef.current) return;
        const payload: WSActionData = {
            action: ACTIONS.START_DRAWING,
            data: {
                is_drawing: true,
                last_position_x: lastPositionX,
                last_position_y: lastPositionY,
            }
        };
        webSocketRef.current.send(JSON.stringify(payload));
    };

    const onDrawing = (e: MouseEvent) => {
        if (!webSocketRef.current || !canvasRef.current || !isDrawingRef.current || !shouldSendDataRef.current)
            return;
        currentDrawingDataRef.current = getPixelData(e, canvasRef.current);
        sendDrawData(e);
        shouldSendDataRef.current = false;
    };

    const onStopDrawing = () => {
        if (!webSocketRef.current || !isDrawingRef.current) return;
        const payload: WSActionData = {
            action: ACTIONS.STOP_DRAWING,
            data: {is_drawing: false}
        };
        webSocketRef.current.send(JSON.stringify(payload));
    };

    const sendDrawData = (e: MouseEvent) => {
        if (!canvasRef.current || !webSocketRef.current) return;
        const canvas = canvasRef.current;

        const payload: WSActionDrawingData = {
            action: ACTIONS.DRAWING,
            data: getPixelData(e, canvas),
        };
        webSocketRef.current.send(JSON.stringify(payload));
    };

    const getPixelData = (e: MouseEvent, canvas: HTMLCanvasElement) => {
        return {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top,
            color: DEFAULT_DRAW_COLOR,
            size: DEFAULT_DRAW_SIZE,
        }
    };

    const drawLine = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
        if ([lastPositionRef.current.x, lastPositionRef.current.y].includes(OUT_OF_BOUNDS_VALUE)) return;

        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastPositionRef.current.x = x;
        lastPositionRef.current.y = y;
    };

    const update = (deltaTime: number) => {
        if (frameTimerRef.current > FRAME_INTERVAL) {
            // console.log(frameTimerRef.current)
            shouldSendDataRef.current = true;
            frameTimerRef.current = 0;
        } else {
            frameTimerRef.current += deltaTime;
        }
    };
    const animate = (timeStamp: number) => {
        const deltaTime = timeStamp - lastTimeRef.current;
        lastTimeRef.current = timeStamp;
        update(deltaTime);
        requestAnimationFrame(animate);
    };

    return (
        <div>
            <canvas ref={canvasRef} width="800" height="600" style={{border: '1px solid black'}}></canvas>
        </div>
    );
};


export default Canvas;
