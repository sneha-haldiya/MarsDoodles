import React, { useEffect, useState } from 'react'
import { socket } from '../../../context/socket';
import ChatMessages from './ChatMessages';

const Chatbar = ({ roomNumber, userName }) => {
  // const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        room: roomNumber,
        author: userName,
        mess: message,
      };

      //console.log(message);
      socket.emit("send_message", messageData);
      //setMessageList((list) => [...list, messageData]);
      document.getElementById("formId").reset();
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, []);

  return (
    <div className='flex flex-col bg-purple-200'>
      <div className='flex flex-col grow overflow-x-hidden overflow-y-auto  max-h-[520px] p-2'>
        <div className='contents flex-1 overflow-y-auto'>
          {messageList.map((messageContent, index) => {
            return (<ChatMessages key={index} isbot={messageContent.author === 'GameBot'} isSelf={userName === messageContent.author} {...messageContent} />)
          })}
        </div>
      </div>
      <div className='flex p-2 pb-1 bg-purple-200'>
        <form id='formId' action='' style={{width: "100%"}} className="flex flex-row " onSubmit={(e) => { e.preventDefault() }}>
          <input
            type="text"
            placeholder="your guess.."
            autoComplete="off"
            className="rounded-l-md focus:outline-none w-[-webkit-fill-available] p-1 pl-2 pr-2 xl:text-md lg:text-md md:text-sm"
            onChange={(event) => { setMessage(event.target.value) }}
          />
          <button type='submit' className="bg-purple-600 text-white rounded-r-md justify-self-end"
            onClick={sendMessage}>
            <span className="ml-2 mr-2">Send</span>
          </button>
        </form>
      </div>
    </div>


  )
}

export default Chatbar

