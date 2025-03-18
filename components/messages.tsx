import Message from '@/components/message';

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces';

interface Props {
  openedConversation: ConversationInterface | null,
  loadedOptimisitcMessages: MessageInterface[],
  user_id: string,
  loadingMessages: boolean
}

export default function Messages({ openedConversation, user_id, loadingMessages, loadedOptimisitcMessages }: Props) {

  if(!openedConversation?.messages) return <div>Loading...</div>
  const loadedMessages = openedConversation.messages

  const filtered_participants = openedConversation?.participants.filter((participant) => participant.profile.user_id != user_id)
  const noChatOppened = <div className='flex flex-col items-center p-4 justify-center'><h1>Welcome to chat</h1><h3>Click on a conversation to load</h3></div>
  const noMessageSent = <div className='flex flex-col items-center p-4 justify-center'><h1>Talk to {filtered_participants && filtered_participants[0].profile.username}</h1><h3>Start typing and press Enter</h3></div>

  const realMessages = loadedMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const optimisticMessages = loadedOptimisitcMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return (
    <div className='px-4 flex flex-col gap-2'>
      {loadingMessages && <div>Loading...</div>}
      {!loadingMessages && !openedConversation && noChatOppened}
      {!loadingMessages && openedConversation && ( loadedMessages.length == 0 ? noMessageSent : realMessages.map((m) => <Message key={m.id} message={m} user_id={user_id} />) )}
      {!loadingMessages && openedConversation && loadedMessages.length > 0 && optimisticMessages.map((m) => <Message optmistic={true} key={m.id} message={m} user_id={user_id} />)}
    </div>
  )
}
