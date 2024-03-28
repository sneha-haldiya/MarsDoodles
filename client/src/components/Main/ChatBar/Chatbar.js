import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../context/socket';
import ChatMessages from './ChatMessages';


const Chatbar = ({ roomNumber, userName }) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        room: roomNumber,
        author: userName,
        mess: message,
        time:
          new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      //console.log(message);
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      document.getElementById("formId").reset();
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className='flex flex-col bg-purple-200 p-2' >
      <div className='h-[-webkit-fill-available]'>
          {messageList.map((messageContent, index) => {
            return (<ChatMessages key={index} isSelf={userName === messageContent.author} {...messageContent} />)
          })}
      </div>
      <div>
        <form id='formId' action='' className="flex flex-row" onSubmit={(e) => { e.preventDefault() }}>
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

