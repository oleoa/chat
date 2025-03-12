"use client"

import { useState } from 'react';
import Search from '@/components/search';
import Conversation from '@/components/conversation';
import Message from '@/components/message';
import Keybar from '@/components/keybar';

interface Props {
  user_id: string,
  conversations: any[], // To It Later
  messages: any[] // To It Later
}

function getRandomString(length: number) {
  return [...Array(length)]
      .map(() => Math.random().toString(36)[2]) // Get random character
      .join('');
}

export default function Home({ user_id, conversations, messages }: Props) {

  const [allSavedMessages, setAllSavedMessages] = useState(messages)
  const [currentOpenConversation, setCurrentOpenConversation] = useState("1")
  const [filteredMessages, setFilteredMessages] = useState(allSavedMessages.filter((m) => m.conversation_id == "1"))

  const changeConversation = (conversation_id: string) => {
    setCurrentOpenConversation(conversation_id)
    setFilteredMessages(allSavedMessages.filter((m) => m.conversation_id == conversation_id))
  }

  const newMessage = (message: string) => {
    const newMessage = 
      {
        id: getRandomString(10),
        conversation_id: currentOpenConversation,
        sender_id: user_id,
        message: message,
        created_at: 1741794403
      }
    setAllSavedMessages((a) => {
      return [...a, newMessage]
    })
    setFilteredMessages((m) => {
      return [...m, newMessage]
    })
  }

  return (
      <div className='flex flex-grow w-screen'>

        <div id="sidebar" className='border-r-2 flex flex-col'>
          <Search />
          {conversations.map((conversation) => <Conversation currentlyOpened={currentOpenConversation == conversation.id} handleClick={changeConversation} key={conversation.id} conversation={conversation} />)}
        </div>

        <div id="conversation" className='w-full p-4 relative flex flex-col gap-2'>
          {filteredMessages.map((m) => <Message key={m.id} message={m} user_id={user_id} />)}
          <Keybar handleNewMessage={newMessage} />
        </div>

      </div>
  );
}
