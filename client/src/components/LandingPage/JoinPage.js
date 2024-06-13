import React, { useState } from 'react'
import { socket } from '../../context/socket';

const LandingPage = ({playerName}) => {
    /* const [playerName, setPlayerName] = useState(""); */
    const [roomName, setRoomName] = useState("");
   /*  const playerNameRegEx = new RegExp("^[a-zA-Z][a-zA-Z0-9_ ]*"); */
    const roomNameRegEx = new RegExp("^[0-9]+")

    const onJoinGame = () => {
        socket.connect();
        if(/* !playerNameRegEx.test(playerName) ||  */!roomNameRegEx.test(roomName))
        {
            alert("Enter the name starting with an alphabet");
            return;
        }
        socket.emit("join_room", ({playerName, roomName}))
    }

    return (
        <div className='bg-black bg-opacity-20 p-4 rounded-md bg-black bg-opacity-35 justify-center w-11/12 md:w-3/4 lg:w-2/3 shadow-md rounded-lg text-center border-white border-2 shadow-[0px_0px_20px_5px_rgb(0,183,255)]'>
            <div className='flex flex-col'>
				{/* <label className='text-left text-base text-white font-semibold mb-1'>Player Name <i className="fas fa-hand-point-down"></i></label>
                <input type='text' placeholder='Enter GamerTag' className='p-2 pt-1 pb-1 mb-3 outline-0 border border-gray-300 rounded-md' id='Name' onChange={e=>setPlayerName(e.target.value)} required/>           */}
				<label className='text-left text-base text-white font-semibold mb-1'>Room Name <i className="fas fa-hand-point-down"></i></label>
                <input type='number' placeholder='Enter Room Name' className='p-2 pt-1 pb-1 mb-5 outline-0 border border-gray-300 rounded-md' id='Room' onChange={e=>setRoomName(e.target.value)}  required/>
                <button type='submit' id='enterButton' className='p-2 pt-1 pb-1 outline-0 rounded-md bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white' onClick={onJoinGame}>
                    Join Room
                </button>
            </div>
        </div>
    )
}

export default LandingPage