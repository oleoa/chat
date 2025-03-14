"use client"

import { createClient } from '@/supabase/client'
import { useEffect, useState } from 'react';
import Search from '@/components/search';
import Conversation from '@/components/conversation';
import Message from '@/components/message';
import Keybar from '@/components/keybar';

interface Props {
  user_id: string,
  conversations: any[]
}

export default function Home({ user_id, conversations }: Props) {

  const supabase = createClient()

  const [currentlyOpenedConversation, setCurrentlyOpenedConversation] = useState(0)
  const [currentlyLoadedMessages, setCurrentlyLoadedMessages] = useState<any[]>([]);

  const changeConversation = (id: number): void => {
    setCurrentlyOpenedConversation(id);
  }

  const newMessage = (message: string): void => {
    const sendNewMessage = async () => {
      const { data, error } = await supabase.from("messages").insert([
        { conversation_id: currentlyOpenedConversation, sender_id: user_id, message: message }
      ]).select()
      if (!data)
        console.error("Error at sending the message")
      else {
        const newMessageId = data[0].id
        const newMessageCreatedAt = data[0].created_at
        setCurrentlyLoadedMessages((m) => {
          const newMessages = [
            {
              id: newMessageId,
              message: message,
              conversation_id: currentlyOpenedConversation,
              sender_id: user_id,
              created_at: newMessageCreatedAt
            },
            ...m
          ]
          return newMessages.sort((a, b) => a.id - b.id)
        })
      }
    }
    sendNewMessage()
  }

  useEffect(() => {
    const getMessagesFromDB = async () => {
      const { data: messages, error } = await supabase.from("messages").select().eq("conversation_id", currentlyOpenedConversation)
      setCurrentlyLoadedMessages(messages?.sort((a, b) => a.id - b.id) ?? [])
    }
    if (currentlyOpenedConversation != 0)
      getMessagesFromDB()
  }, [currentlyOpenedConversation])

  return (
      <div className='flex flex-grow w-screen'>

        <div id="sidebar" className='border-r-2 flex flex-col'>
          <Search />
          {conversations.map((conversation) => (
            <Conversation currentlyOpened={currentlyOpenedConversation == conversation.id} handleClick={changeConversation} conversation={conversation} key={conversation.conversation_id} />
          ))}
        </div>

        <div id="conversation" className='w-full p-4 relative flex flex-col gap-2'>
          {currentlyLoadedMessages.length > 0 ?
            currentlyLoadedMessages.map((m) => <Message key={m.id} message={m} user_id={user_id} />):
            <div className='flex flex-col items-center p-4 justify-center'>
              <h1>Welcome to chat</h1>
              <h3>Click on a conversation to load</h3>
            </div>
          }
          <Keybar handleNewMessage={newMessage} />
        </div>

      </div>
  );
}
