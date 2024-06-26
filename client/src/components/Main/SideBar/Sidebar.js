import React, { useContext, useRef, useState } from 'react'
import { SocketContext } from '../../../context/socket';


const Sidebar = ({ roomNumber, isHost, isLead }) => {
  const modalRef = useRef(null);
  const socket = useContext(SocketContext);
  const [list, setList] = useState([]);
  const [winnerList, setWinnerList] = useState([]);

  socket.on("update", ({ l }) => {
    console.log(l);
    l = JSON.parse(l);
    console.log(l);
    setList(l.map((p, index) =>
      <li className='flex flex-row' key={index + 1}>{p.playerName} {p.points} {p.isHost ? " 🧑🏻‍🔧" : null}{p.isLead ? " 🧑🏻‍🎨" : null} {!(isHost & p.isHost) && <div>{isHost && <button className='bg-red-500 p-1 pt-0 pb-0 ml-1 rounded text-sm' onClick={() => { socket.emit("kick_player", ({ player: p })) }}> kick </button>}</div>}</li>
    ))
  });

  socket.on("update_points", (l) => {
    console.log(l);
    modalRef.current.showModal();
    setWinnerList(l.map((p, index) =>
      <li className='list-none' key={index + 1}>{p.playerName} {p.points}<span className={`${p.gainPoints !== 0 ? "" : (p.gainPoints > 0 ? "text-green-600" : "text-red-600")}`}>{p.gainPoints === 0 ? "  " : p.gainPoints > 0 ? " + " : " - "}{p.gainPoints}</span></li>
    ))
  })

  const copyRoomNumber = () => {
    navigator.clipboard.writeText(roomNumber).then(
      () => {
        console.log('copied');
      },
      err => {
        console.error('Failed', err);
      }
    );
  };

  return (
    <>
      <dialog ref={modalRef} className='bg-white/0 w-[70vw] h-[70vh] backdrop:bg-black/65'>
        <div className='p-4 bg-slate-300 rounded-lg flex flex-col text-xl'>
          <h1 className='self-center text-5xl'>Round Result</h1>
          {winnerList}
          <button onClick={() => modalRef.current?.close()}>close</button>
        </div>
      </dialog>
      <div className='flex flex-col bg-[#9f71db] max-w-full p-5 text-white text-base rounded-bl-md'>
        <h1 className='font-bold'><i className="fas fa-comments"></i> Room Id :</h1>
        <h1>{roomNumber} <button className="bg-blue-300 p-1 ml-1 rounded text-sm hover:bg-blue-500 active:bg-blue-800" onClick={copyRoomNumber}><i className="fas fa-solid fa-copy"></i></button></h1>
        <h1 className='font-bold'><i className="fas fa-users"></i> Players :</h1>
        <div className='list-none'>{list}</div>
      </div>
    </>

  )
}

export default Sidebar