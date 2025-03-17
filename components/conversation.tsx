'use client'

import { useEffect, useRef, useState } from 'react'

import { createClient } from '@/supabase/client'

import Keybar from '@/components/keybar'
import Messages from '@/components/messages'

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces'

interface Props {
  user_id: string
  openedConversation: ConversationInterface | null
  loadedMessages: MessageInterface[]
  setLoadedMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>
}

export default function Conversation({ user_id, openedConversation, loadedMessages, setLoadedMessages }: Props) {
  
  const supabase = createClient()

  const [loadedFakeMessages, setLoadedFakeMessages] = useState<MessageInterface[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const realtimeChannel = useRef<any | null>(null)

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
        if(!res.ok)
          console.error("Error creating the message: ", await res.json())
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
      realtimeChannel.current = channel
    }
    return () => {
      if (realtimeChannel.current)
        supabase.removeChannel(realtimeChannel.current)
    }
  }, [openedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loadedMessages, loadedFakeMessages]);

  return (
    <div id="messages-holder" className='p-4 flex flex-col gap-2'>
      <Messages openedConversation={openedConversation} loadedMessages={loadedMessages} loadedFakeMessages={loadedFakeMessages} user_id={user_id} loadingMessages={loadingMessages} />
      <span ref={messagesEndRef} />
      {openedConversation && <Keybar handleNewMessage={newMessage} />}
    </div>
  )
}
