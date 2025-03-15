/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/supabase/client'

import Keybar from '@/components/keybar';
import Sidebar from '@/components/sidebar';
import Messages from '@/components/messages';

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces';

interface Props {
  user_id: string,
  conversations: ConversationInterface[]
}

export default function Home({ user_id, conversations }: Props) {

  const supabase = createClient()

  const [loadedConversations, setLoadedConversations] = useState<ConversationInterface[]>(conversations)

  const [openedConversation, setOpenedConversation] = useState<ConversationInterface | null>(null)

  const [loadedMessages, setLoadedMessages] = useState<MessageInterface[]>([])

  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [realtimeChannel, setRealtimeChannel] = useState<any | null>()

  const changeConversation = (id: number): void => {
    const newOpenedConversation = loadedConversations.find((conversation) => conversation.id == id)
    if (!newOpenedConversation)
      console.error("Error finding the conversation")
    else
      setOpenedConversation(newOpenedConversation);
  }

  const newConversation = (new_user_id: string): void => {
    const createNewConversation = async () => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({
            from_user_id: user_id,
            to_user_id: new_user_id,
          }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.ok) {
        const resopnse = await res.json()
        const newConversations = resopnse.data
        if (!newConversations)
          console.error("Error at getting the conversations back")
        else
          setLoadedConversations(newConversations)
      } else {
        console.error("Error at creating the conversation: ", await res.json())
      }
    }
    createNewConversation()
  }

  const newMessage = (message: string): void => {
    const sendNewMessage = async () => {
      if (!openedConversation)
        console.error("Trying to create a message for a non opened conversation")
      else {
        const res = await fetch("/api/messages", {
          method: "POST",
          body: JSON.stringify({
              sender_id: user_id,
              conversation_id: openedConversation.id,
              message: message
            }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (!res.ok)
          console.error("Error creating the message")
      }
    }
    sendNewMessage()
  }

  useEffect(() => {
    if (openedConversation){

      setLoadingMessages(true)
      const getMessagesFromDB = async () => {
        const res = await fetch("/api/messages/"+openedConversation.id)
        if (!res.ok)
          console.error("Error at getting the messages")
        else {
          const data = await res.json()
          const messages = data.data
          setLoadedMessages(messages.sort((a: any, b: any) => a.id - b.id) ?? [])
        }
        setLoadingMessages(false)
      }
      getMessagesFromDB()

      const channel = supabase.channel('custom-filter-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: 'conversation_id=eq.'+openedConversation.id },
        (payload) => {
          const newMessageArrived: MessageInterface = payload.new
          console.log(newMessageArrived)
          setLoadedMessages((m) => [...m, newMessageArrived])
        }
      )
      .subscribe()
      setRealtimeChannel(channel)
      
    }
    return () => {
      if (realtimeChannel)
        supabase.removeChannel(realtimeChannel)
    }
  }, [openedConversation])

  // Scroll to bottom on mount and when messages update
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200)
  }, [loadedMessages]);

  return (
    <div className='w-screen h-screen pl-4'>

      <Sidebar user_id={user_id} handleNewConversation={newConversation} handleChangeConversation={changeConversation} loadedConversations={loadedConversations} openedConversation={openedConversation} />

      <div id="messages-holder" className='p-4 flex flex-col gap-2'>
        <Messages openedConversation={openedConversation} loadedMessages={loadedMessages} user_id={user_id} loadingMessages={loadingMessages} />
        <span ref={messagesEndRef} />
        <Keybar handleNewMessage={newMessage} />
      </div>

    </div>
  );
}
