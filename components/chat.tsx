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
  const [loadedFakeMessages, setLoadedFakeMessages] = useState<MessageInterface[]>([])

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
      if (!res.ok) {
        console.error("Error at getting the conversations back")
      }
    }
    createNewConversation()
  }

  const newMessage = (message: string): void => {
    const sendNewMessage = async () => {
      if (!openedConversation)
        console.error("Trying to create a message for a non opened conversation")
      else {
        setLoadedFakeMessages([{
          id: "string",
          conversation_id: openedConversation.id.toString(),
          sender_id: user_id,
          message: message,
          created_at: new Date().toISOString()
        }])
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
      const getMessagesFromDB = async () => {
        setLoadingMessages(true)
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

      const channel = supabase.channel('messages-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: 'conversation_id=eq.'+openedConversation.id },
        (payload) => {
          const newMessageArrived = payload.new as MessageInterface
          if (newMessageArrived.sender_id == user_id)
            setLoadedFakeMessages([])
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loadedMessages, loadedFakeMessages]);

  useEffect(() => {
    const channel = supabase.channel('conversations-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants', filter: 'user_id=eq.'+user_id },
        async (payload) => {
          const res = await fetch("/api/conversations/"+user_id)
          if(!res.ok)
            console.error("Error fetching your conversations")
          else {
            const response = await res.json()
            const conversations: ConversationInterface[] = response.data
            setLoadedConversations(conversations)
          }
        }
      )
      .subscribe()
      setRealtimeChannel(channel)
  }, [])

  return (
    <div className='w-screen h-screen pl-4'>
      <Sidebar user_id={user_id} handleNewConversation={newConversation} handleChangeConversation={changeConversation} loadedConversations={loadedConversations} openedConversation={openedConversation} />
      <div id="messages-holder" className='p-4 flex flex-col gap-2'>
        <Messages openedConversation={openedConversation} loadedMessages={loadedMessages} loadedFakeMessages={loadedFakeMessages} user_id={user_id} loadingMessages={loadingMessages} />
        <span ref={messagesEndRef} />
        <Keybar handleNewMessage={newMessage} />
      </div>
    </div>
  );
}
