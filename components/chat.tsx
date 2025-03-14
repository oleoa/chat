/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createClient } from '@/supabase/client'
import { useEffect, useState } from 'react';
import Search from '@/components/search';
import Conversation from '@/components/conversation';
import Message from '@/components/message';
import Keybar from '@/components/keybar';

interface Conversation {
  conversation_id: number,
  group_name: string,
  is_group: boolean,
  participants: string[]
}

interface Props {
  user_id: string,
  conversations: Conversation[]
}

export default function Home({ user_id, conversations }: Props) {

  const supabase = createClient()

  const [loadedConversations, setLoadedConversations] = useState<Conversation[]>(conversations)
  const [openedConversation, setOpenedConversation] = useState<Conversation | null>(null)
  const [loadedMessages, setLoadedMessages] = useState<any[]>([])
  const [realtimeChannel, setRealtimeChannel] = useState<any | null>()

  const changeConversation = (id: number): void => {
    const newOpenedConversation = loadedConversations.find((c) => c.conversation_id == id)
    if (!newOpenedConversation)
      console.error("Error finding the conversation")
    else
      setOpenedConversation(newOpenedConversation);
  }

  const newConversation = (new_user_id: string): void => {
    const createNewConversation = async () => {
      const { data: new_conversation, error: new_conversation_error } = await supabase.from("conversations").insert([
        { created_by: user_id }
      ]).select()
      if (!new_conversation || new_conversation_error)
        console.error("Error creating the conversation ", new_conversation_error)
      else {
        const newConversationId = new_conversation[0].id
        const { error: new_participants_error } = await supabase.from("participants").insert([
          { user_id: user_id, conversation_id: newConversationId },
          { user_id: new_user_id, conversation_id: newConversationId }
        ]).select()
        if (new_participants_error)
          console.error("Error creating new participants ", new_participants_error)
        else {
          const { data: newConversations, error: newConversationsError } = await supabase.rpc("get_user_conversations", { p_user_id: user_id });
          if (!newConversations || newConversationsError)
            console.error("Error at re-gaining the conversations ", newConversationsError)
          else
            setLoadedConversations(newConversations)
        }
      }
    }
    createNewConversation()
  }

  const newMessage = (message: string): void => {
    const sendNewMessage = async () => {
      if (!openedConversation)
        console.error("Trying to create a message for a non opened conversation")
      else {
        const { data, error } = await supabase.from("messages").insert([
          { conversation_id: openedConversation.conversation_id, sender_id: user_id, message: message }
        ]).select()
        if (!data || error)
          console.error("Error at sending the message ", error)
        else {
          const newMessageId = data[0].id
          const newMessageCreatedAt = data[0].created_at
          setLoadedMessages((m) => {
            const newMessages = [
              {
                id: newMessageId,
                message: message,
                conversation_id: openedConversation.conversation_id,
                sender_id: user_id,
                created_at: newMessageCreatedAt
              },
              ...m
            ]
            return newMessages.sort((a, b) => a.id - b.id)
          })
        }
      }
    }
    sendNewMessage()
  }

  useEffect(() => {
    if (openedConversation){
      const getMessagesFromDB = async () => {
        const { data: messages, error } = await supabase.from("messages").select().eq("conversation_id", openedConversation.conversation_id)
        if (error)
          console.error("Error at getting the messages: ", error)
        setLoadedMessages(messages?.sort((a, b) => a.id - b.id) ?? [])
      }
      getMessagesFromDB()
      const channel = supabase.channel('custom-filter-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: 'conversation_id=eq.'+openedConversation.conversation_id },
        (payload) => {
          const newMessageArrived = payload.new
          setLoadedMessages((m) => [newMessageArrived, ...m].sort((a, b) => a.id - b.id))
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

  return (
      <div className='flex flex-grow w-screen'>

        <div id="sidebar" className='border-r-2 flex flex-col'>
          <Search handleNewConversation={newConversation} />
          {loadedConversations.map((conversation) => (
            <Conversation currentlyOpened={openedConversation ? openedConversation.conversation_id == conversation.conversation_id : false} handleClick={changeConversation} conversation={conversation} key={conversation.conversation_id} />
          ))}
        </div>

        <div id="conversation" className='w-full p-4 relative flex flex-col gap-2'>
          {
            openedConversation ?
              loadedMessages.length == 0 ? (
                <div className='flex flex-col items-center p-4 justify-center'>
                  <h1>Talk to {openedConversation.participants[0]}</h1>
                  <h3>Start typing and press Enter</h3>
                </div>
              ) : loadedMessages.map((m) => <Message key={m.id} message={m} user_id={user_id} />):
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
