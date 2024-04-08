import React from 'react'
import TextReceive from './TextReceive'
import TextSend from './TextSend'
import TextBot from './TextBot'

const ChatMessages = (data) => {
    let isSelf = data.isSelf;
    let isbot = data.isbot;
  return (
    <div>
    {!isSelf && !isbot && <TextReceive {...data}/>}
    {isSelf && !isbot &&  <TextSend {...data}/>}
    {isbot && <TextBot {...data}/>}
    </div>
  )
}

export default ChatMessages