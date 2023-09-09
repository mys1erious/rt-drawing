'use client';

import Link from "next/link";
import {useState} from "react";


const RoomSelector = () => {
    const [roomName, setRoomName] = useState('');
    return (
        <div className="flex flex-col border rounded-lg p-2">
            <input className="border" type="text" name="roomName" placeholder="Enter room name"
                   onChange={(e) => setRoomName(e.target.value)}
            />
            <Link className="font-bold underline border" href={`/drawing/${roomName}/`}>Draw</Link>
        </div>
    );
};


export default RoomSelector;
