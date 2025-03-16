import { createClient } from '@/supabase/server'
import Chat from '@/components/chat';
import { Conversation } from "@/interfaces"
import ServerError from '@/components/serverError';

export default async function Home() {

  const supabase = await createClient()

  const { data: user_data, error: user_error } = await supabase.auth.getUser()
  const user = user_data.user

  if (!user || user_error)
    return <ServerError message='Error fetching your authentication' />
  
  const res = await fetch(process.env.NEXT_PUBLIC_URL+"/api/conversations/"+user.id);
  if(!res.ok)
    return <ServerError message='Error fetching your conversations' />

  const response = await res.json()
  const conversations: Conversation[] = response.data

  return (
    <main>
      <Chat user_id={user.id} conversations={conversations} />
    </main>
  );
}
