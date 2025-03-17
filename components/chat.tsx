/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/supabase/client'

import Sidebar from '@/components/sidebar'
import Conversation from '@/components/conversation'

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces';

interface Props {
  user_id: string,
  conversations: ConversationInterface[]
}

export default function Home({ user_id, conversations }: Props) {

  const [loadedConversations, setLoadedConversations] = useState<ConversationInterface[]>(conversations)
  const [openedConversation, setOpenedConversation] = useState<ConversationInterface | null>(null)

  const [loadedMessages, setLoadedMessages] = useState<MessageInterface[]>([])

  return (
    <div className='w-screen h-screen pl-4'>
      <Sidebar
        user_id={user_id}
        loadedMessages={loadedMessages}
        loadedConversations={loadedConversations}
        setLoadedConversations={setLoadedConversations}
        openedConversation={openedConversation}
        setOpenedConversation={setOpenedConversation}
      />
      <Conversation
        user_id={user_id}
        loadedMessages={loadedMessages}
        setLoadedMessages={setLoadedMessages}
        openedConversation={openedConversation}
      />
    </div>
  );
}
