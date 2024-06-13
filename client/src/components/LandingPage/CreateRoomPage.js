import React, { useState } from 'react'
import { socket } from '../../context/socket';
const LandingPage = ({playerName}) => {

    /* const [playerName, setPlayerName] = useState(""); */
    const [playerCount, setPlayerCount] = useState(2);
    const [playTime, setPlayTime] = useState("");
    // const playerNameRegEx = /^[a-zA-Z][a-zA-Z0-9_ ]*/;

    const onCreateGame = () => {
        socket.connect();
        /* if (!playerNameRegEx.test(playerName)) {
            alert("Enter the name starting with an alphabet");
            return;
        } */
        if (playerCount > 10 || playerCount < 2) {
            alert("Enter a valid number of players [2 - 10]");
            return;
        }
        if (playTime === "") {
            alert("Choose a valid time interval for games");
            return;
        }
        //console.log(playerName + " " + playerCount + " " + playTime + " create room name called(client)")
        socket.emit("create_room", ({playerName, playerCount, playTime}));
    }


    return (
        <div className='bg-black bg-opacity-20 p-4 rounded-md bg-black bg-opacity-35 justify-center w-11/12 md:w-3/4 lg:w-2/3 shadow-md rounded-lg text-center border-white border-2 shadow-[0px_0px_20px_5px_rgb(0,183,255)]'>
            <div className='flex flex-col'>  
{/* 				<label className='text-left text-base text-white font-semibold mb-1'>Player Name <i className="fas fa-hand-point-down"></i></label>
                <input type='text' placeholder='Enter GamerTag' className='p-2 pt-1 pb-1 mb-3 outline-0 border border-gray-300 rounded-md' id='Name' onChange={e => setPlayerName(e.target.value)} required /> */}
				<label className='text-left text-base text-white font-semibold mb-1'>Players <i className="fas fa-hand-point-down"></i></label>
                <input type='number' min={2} max={10} placeholder='Enter Player Count'  className='p-2 pt-1 pb-1 mb-4 outline-0 border border-gray-300 rounded-md' id='Count' onChange={e => setPlayerCount(e.target.value)} required />
              
                <div className='flex flex-col bg-indigo-500/60 p-2 rounded-md mb-4'>
                    <h4 className='font-bold  text-white self-center'>Choose Time</h4>
                    <hr className='mt-0.5 mb-1.5' />
                    <ul className="flex flex-row justify-between">
                        <li>
                            <input type="radio" id="time030" name="hosting" value="time030" className="hidden peer" onClick={e => setPlayTime(30)} />
                            <label htmlFor="time030" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold text-white">0:30</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="time100" name="hosting" value="time100" className="hidden peer" onClick={e => setPlayTime(60)} />
                            <label htmlFor="time100" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold text-white">1:00</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="time130" name="hosting" value="time130" className="hidden peer" onClick={e => setPlayTime(90)} />
                            <label htmlFor="time130" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold text-white">1:30</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="time200" name="hosting" value="time200" className="hidden peer" onClick={e => setPlayTime(120)} />
                            <label htmlFor="time200" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold text-white">2:00</div>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
                <button type='submit' id='enterButton' className='p-2 pt-1 pb-1 outline-0 rounded-md bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white' onClick={onCreateGame}>
                    Create Game
                </button>
            </div>
        </div>
    )
}

export default LandingPage