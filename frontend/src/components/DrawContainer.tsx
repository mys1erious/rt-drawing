'use client';

import Canvas from "@/components/Canvas";


type DrawContainerProps = {
    roomName?: string
};


const DrawContainer = ({roomName}: DrawContainerProps) => {
    return (
        <div>
            <div>Canvas</div>
            <Canvas roomName={roomName}/>
        </div>
    );
};


export default DrawContainer;
