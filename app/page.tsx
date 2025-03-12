import { createClient } from '@/supabase/server'
import Chat from '@/components/chat';

export default async function Home() {

  const supabase = await createClient()

  const { data: user_data, error: user_error } = await supabase.auth.getUser()
  const user = user_data.user
  
  const { data: dataGetParticipants, error: errorGetParticipants } = await supabase.from("participants").select().eq("user_id", user?.id)
  const allConversationsImInIds = dataGetParticipants?.map((p) => p.id) ?? []

  const { data: dataGetConversations, error: errorGetConversations } = await supabase.from("conversations").select().in("id", allConversationsImInIds)
  const conversations = dataGetConversations ?? []
  
  const allConversationsIds = conversations.map((c) => c.id)
  const { data: dataGetMessages, error: errorGetMessages } = await supabase.from("messages").select().in("conversation_id", allConversationsIds)
  const messages = dataGetMessages ?? []
  
  return (
    <main>
      <Chat user_id={user?.id ?? ""} conversations={conversations} messages={messages} />
    </main>
  );
}
