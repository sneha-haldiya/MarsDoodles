import React, { useContext, useState } from 'react'
import { SocketContext } from '../context/socket';
const LandingPage = () => {
    const socket = useContext(SocketContext);

    const [playerName, setPlayerName] = useState("");
    const [playerCount, setPlayerCount] = useState(2);
    const [playTime, setPlayTime] = useState("");
    const playerNameRegEx = new RegExp("^[a-zA-Z][a-zA-Z0-9_ ]*");

    const onCreateGame = () => {
        if (!playerNameRegEx.test(playerName)) {
            alert("Enter the name starting with an alphabet");
            return;
        }
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
        <div className='bg-black bg-opacity-20 p-4 rounded-md'>
            <div className='flex flex-col'>

                <input type='text' placeholder='Enter GamerTag' className='p-2 pt-1 pb-1 outline-0 rounded-md' id='Name' onChange={e => setPlayerName(e.target.value)} required />
                <br />
                <input type='number' min={2} max={10} placeholder='Enter Player Count' className='p-2 pt-1 pb-1 outline-0 rounded-md' id='Count' onChange={e => setPlayerCount(e.target.value)} onKeyDown={() => { }} required />
                <br />
                <div className='flex flex-col w-100 bg-slate-500 p-2 rounded-md'>
                    <h4 className='font-bold font-white self-center'>Choose Time</h4>
                    <hr className='mt-0.5 mb-1.5' />
                    <ul className="flex flex-row justify-between">
                        <li>
                            <input type="radio" id="time030" name="hosting" value="time030" className="hidden peer" onClick={e => setPlayTime("0:30")} />
                            <label htmlFor="time030" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold">0:30</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="time100" name="hosting" value="time100" className="hidden peer" onClick={e => setPlayTime("1:00")} />
                            <label htmlFor="time100" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold">1:00</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="time130" name="hosting" value="time130" className="hidden peer" onClick={e => setPlayTime("1:30")} />
                            <label htmlFor="time130" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold">1:30</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="time200" name="hosting" value="time200" className="hidden peer" onClick={e => setPlayTime("2:00")} />
                            <label htmlFor="time200" className="inline-flex items-center justify-between w-full p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block">
                                    <div className="text-xs font-semibold">2:00</div>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
                <br />
                <button type='submit' id='enterButton' className='p-2 pt-1 pb-1 outline-0 rounded-md bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white' onClick={onCreateGame}>
                    Create Game
                </button>
            </div>
        </div>
    )
}

export default LandingPage