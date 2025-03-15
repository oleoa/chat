'use client'

import Search from '@/components/search'
import Conversation from '@/components/conversation'

import { HandleNewConversation, HandleClickFunction, Conversation as ConversationInterface } from '@/interfaces'

interface Props {
  handleNewConversation: HandleNewConversation,
  handleChangeConversation: HandleClickFunction,
  loadedConversations: ConversationInterface[],
  openedConversation: ConversationInterface | null,
  user_id: string,
}

export default function Sidebar({ handleNewConversation, handleChangeConversation, loadedConversations, openedConversation, user_id }: Props) {
  return (
    <div id="sidebar">
      <Search handleNewConversation={handleNewConversation} />
      {loadedConversations.map((conversation) => {
        return <Conversation user_id={user_id} currentlyOpened={openedConversation ? openedConversation.id == conversation.id : false} handleClick={handleChangeConversation} conversation={conversation} key={conversation.id} />
      })}
    </div>
  )
}
