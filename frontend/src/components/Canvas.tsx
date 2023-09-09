'use client';

import {useEffect, useRef, useState} from "react";


type CanvasProps = {
    roomName?: string
};


type DrawingData = {
    x: number;
    y: number;
    color: string;
    size: number;
};


type WSData = {
    action: string;
    data: DrawingData;
};


const Canvas = ({roomName}: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);


    useEffect(() => {
        const canvas: any = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        const wsConnection = new WebSocket(
            `${process.env.NEXT_PUBLIC_BASE_SOCKET_URL}/ws/drawing/${roomName}/`
        );

        wsConnection.onopen = () => {
            console.log('HI SOCKET')
        };

        canvas.addEventListener('mousedown', () => {
            isDrawing = true;
            setDrawing(isDrawing);
        });
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            setDrawing(isDrawing);
            ctx.beginPath();
        });
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            drawPixel(e, isDrawing, wsConnection);
        });

        wsConnection.onmessage = (e) => {
            const ctx = canvasRef.current?.getContext('2d');
            const data: WSData = JSON.parse(e.data);

            if (!ctx || data.action !== 'drawing') return;

            ctx.fillStyle = data.data.color;
            ctx.fillRect(
                data.data.x,
                data.data.y,
                data.data.size,
                data.data.size
            );
        };

        wsConnection.onclose = () => {
            console.error('Drawing socket closed unexpectedly');
        };

        return () => {
            wsConnection.close();
        };
    }, []);

    function drawPixel(e: MouseEvent, isDrawing: boolean, wsConnection: WebSocket) {
        if (!isDrawing || !wsConnection || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;
        const currentColor = '#000000';
        const currentBrushSize = 3;

        const payload: WSData = {
            action: 'drawing',
            data: {
                x: x,
                y: y,
                color: currentColor,
                size: currentBrushSize
            }
        };

        wsConnection.send(JSON.stringify(payload));
    }

    return (
        <div>
            <canvas ref={canvasRef} width="800" height="600" style={{border: '1px solid black'}}></canvas>
        </div>
    );
};


export default Canvas;
