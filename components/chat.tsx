/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useState } from 'react'

import { createClient } from '@/supabase/client'

import Sidebar from '@/components/sidebar'
import Conversation from '@/components/conversation'

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces';

interface Props {
  user_id: string,
  loadedConversations: ConversationInterface[]
}

export default function Home({ user_id, loadedConversations }: Props) {

  const supabase = createClient()

  const [conversations, setConversations] = useState<ConversationInterface[]>(loadedConversations)
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const currentOpenedConversation = useMemo<ConversationInterface | null>(() => conversations.find((c) => c.id == currentConversationId) ?? null, [conversations, currentConversationId])

  useEffect(() => {
    // RESPONSIBLE FOR CREATING THE CHANNEL THAT RECEIVES MESSAGES ALL OVER THE CHAT
    supabase.channel('messages-channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'messages', filter: 'conversation_id=in.(' + conversations.map(c => c.id).join(',') + ')' },
      (payload) => {
        const newMessageArrived = payload.new as MessageInterface
        const newConversations = conversations.map((conversation) => {
          if(conversation.id != newMessageArrived.conversation_id)
            return conversation
          if(!conversation.messages) conversation.messages = []
          conversation.messages = [
            ...conversation.messages,
            newMessageArrived
          ]
          if(newMessageArrived.sender_id == user_id) conversation.optimistic_messages = conversation.optimistic_messages.slice(1);
          return conversation
        })
        setConversations(newConversations)
      }
    )
    .subscribe()

    // // RESPONSIBLE FOR CREATING THE CHANNEL THAT SEARCHES FOR NEW CONVERSATIONS WITH THE USER
    supabase.channel('participants-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'participants', filter: 'user_id=eq.'+user_id },
      async () => {
        const res = await fetch("/api/conversations/"+user_id)
        if(!res.ok)
          console.error("Error fetching your conversations", res)
        else {
          const response = await res.json()
          const conversations: ConversationInterface[] = response.data
          setConversations(conversations)
        }
      }
    )
    .subscribe()
  }, [])

  return (
    <div id="chat" className='w-screen h-screen pl-4'>
      <Sidebar
        user_id={user_id}
        conversations={conversations}
        setConversations={setConversations}
        currentConversationId={currentConversationId}
        setCurrentConversationId={setCurrentConversationId}
      />
      <Conversation
        user_id={user_id}
        currentOpenedConversation={currentOpenedConversation}
        conversations={conversations}
        setConversations={setConversations}
      />
    </div>
  );
}
