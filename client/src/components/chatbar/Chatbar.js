import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../context/socket';
import './Chatbar.css';


const Chatbar = ({ rn, un }) => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        room: rn,
        author: un,
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
    <div className='flex flex-col items-center bg-purple-200 p-5' >
      <div style={{ height: '65vh' }} className='w-full height-48 overflow-y-scroll'>
        {messageList.map((messageContent, index) => {
          return (
            <div className={un === messageContent.author ? "you" : "other"}>
              <div key={index}>
                <div><p>{messageContent.mess}</p></div>
                <div><p>{messageContent.time}</p> <p>{messageContent.author}</p></div>
              </div>
            </div>
          )
        })}
      </div>
      <div>
        <form id='formId' action='' className="flex flex-row items-stretch " onSubmit={(e) => { e.preventDefault() }}>
          <input
            type="text"
            placeholder="your guess.."
            autoComplete="off"
            className="flex rounded-l-lg p-2 focus:outline-none w-full sm:w-auto"
            onChange={(event) => { setMessage(event.target.value) }}
          />
          <button type='submit' className="bg-purple-600 text-white rounded-r-lg px-3 flex items-center"
            onClick={sendMessage}>
            <span className="ml-1">Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chatbar

