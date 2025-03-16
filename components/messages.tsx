import Message from '@/components/message';

import { Conversation as ConversationInterface, Message as MessageInterface } from '@/interfaces';

interface Props {
  openedConversation: ConversationInterface | null,
  loadedMessages: MessageInterface[],
  loadedFakeMessages: MessageInterface[],
  user_id: string,
  loadingMessages: boolean
}

export default function Messages({ openedConversation, loadedMessages, user_id, loadingMessages, loadedFakeMessages }: Props) {

  const noChatOppened = <div className='flex flex-col items-center p-4 justify-center'><h1>Welcome to chat</h1><h3>Click on a conversation to load</h3></div>
  const noMessageSent = <div className='flex flex-col items-center p-4 justify-center'><h1>Talk to {openedConversation?.participants[0].profile.username}</h1><h3>Start typing and press Enter</h3></div>

  const examplesMessages: MessageInterface[] = [
    { id:"0" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"1" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other_guy", created_at:"0" },
    { id:"2" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"3" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"4" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other_guy", created_at:"0" },
    { id:"5" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"6" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other guy", created_at:"0" },
    { id:"7" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"9" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"14" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other_guy", created_at:"0" },
    { id:"10" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other_guy", created_at:"0" },
    { id:"11" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"8" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other_guy", created_at:"0" },
    { id:"13" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
    { id:"12" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:"other guy", created_at:"0" },
    { id:"15" , message: "ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ", conversation_id:"0", sender_id:user_id, created_at:"0" },
  ]
  const squeletonMessages = examplesMessages.map((m) => <Message loading={true} key={m.id} message={m} user_id={user_id} />)

  const realMessages = loadedMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const fakeMessages = loadedFakeMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return (
    <>
      {loadingMessages && squeletonMessages}
      {!loadingMessages && !openedConversation && noChatOppened}
      {!loadingMessages && openedConversation && (
        loadedMessages.length == 0 ?
        noMessageSent :
        realMessages.map((m) => <Message key={m.id} message={m} user_id={user_id} />)
      )}
      {!loadingMessages && openedConversation && loadedMessages.length > 0 && fakeMessages.map((m) => <Message optmistic={true} key={m.id} message={m} user_id={user_id} />)}
    </>
  )
}
