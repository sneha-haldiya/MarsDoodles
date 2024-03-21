import React, { useContext, useState } from 'react'
import { SocketContext } from '../context/socket';

const LandingPage = () => {
    const socket = useContext(SocketContext);

    const [playerName, setPlayerName] = useState("");
    const [roomName, setRoomName] = useState("");
    const playerNameRegEx = new RegExp("^[a-zA-Z][a-zA-Z0-9_ ]*");
    const roomNameRegEx = new RegExp("^[0-9]+")

    const onJoinGame = () => {
        if(!playerNameRegEx.test(playerName) || !roomNameRegEx.test(roomName))
        {
            alert("Enter the name starting with an alphabet");
            return;
        }
        socket.emit("join_room", ({playerName, roomName}))
    }

    return (
        <div className='bg-black bg-opacity-20 p-4 rounded-md'>
            <div className='flex flex-col'>
                
                <input type='text' placeholder='Enter GamerTag' className='p-2 pt-1 pb-1 outline-0 rounded-md' id='Name' onChange={e=>setPlayerName(e.target.value)} required/>
                <br />
                <input type='text' placeholder='Enter Room Name' className='p-2 pt-1 pb-1 outline-0 rounded-md' id='Room' onChange={e=>setRoomName(e.target.value)}  required/>
                <br />
                <button type='submit' id='enterButton' className='p-2 pt-1 pb-1 outline-0 rounded-md bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white' onClick={onJoinGame}>
                    Join Room
                </button>
            </div>
        </div>
    )
}

export default LandingPage