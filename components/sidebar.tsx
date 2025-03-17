'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { createClient } from '@/supabase/client'

import Search from '@/components/search'
import ConversationCard from '@/components/conversationCard'

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces'

interface Props {
  setOpenedConversation: React.Dispatch<React.SetStateAction<ConversationInterface | null>>
  loadedConversations: ConversationInterface[]
  openedConversation: ConversationInterface | null
  loadedMessages: MessageInterface[]
  setLoadedConversations: React.Dispatch<React.SetStateAction<ConversationInterface[]>>
  user_id: string
}

export default function Sidebar({ setOpenedConversation, loadedMessages, loadedConversations, setLoadedConversations, openedConversation, user_id }: Props) {

  const supabase = createClient()

  const participants_channel = useRef<any | null>(null)
  const conversations_channel = useRef<any | null>(null)

  const sortedConversations = useMemo(() => [...loadedConversations].sort((a, b) => new Date(b.last_message?.sent_at! ?? "").getTime() - new Date(a.last_message?.sent_at! ?? "").getTime()), [loadedMessages, loadedConversations])

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

  const changeConversation = (id: number): void => {
    const newOpenedConversation = loadedConversations.find((conversation) => conversation.id == id)
    if (!newOpenedConversation)
      console.error("Error finding the conversation")
    else
      setOpenedConversation(newOpenedConversation);
  }

  useEffect(() => {

    const participantsSupabaseChannel = supabase.channel('participants-channel')
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
          setLoadedConversations(conversations)
        }
      }
    )
    .subscribe()
    participants_channel.current = participantsSupabaseChannel

    const conversationsSupabaseChannel = supabase.channel('conversations-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'conversations', filter: 'id=in.(' + loadedConversations.map((c) => c.id).join(',') + ')' },
      async () => {
        const res = await fetch("/api/conversations/"+user_id)
        if(!res.ok)
          console.error("Error fetching your conversations", res)
        else {
          const response = await res.json()
          const conversations: ConversationInterface[] = response.data
          setLoadedConversations(conversations)
          console.log("Does it get's here?")
        }
      }
    )
    .subscribe()
    conversations_channel.current = conversationsSupabaseChannel

    return () => {
      if (participants_channel)
        supabase.removeChannel(participants_channel.current)
      if (conversations_channel)
        supabase.removeChannel(conversations_channel.current)
    }
  }, [])

  return (
    <div id="sidebar">
      <Search handleNewConversation={newConversation} />
      {sortedConversations.map((conversation, index) => 
        <ConversationCard order={index} user_id={user_id} currentlyOpened={openedConversation ? openedConversation.id == conversation.id : false} handleClick={changeConversation} conversation={conversation} key={conversation.id} />
      )}
    </div>
  )
}
