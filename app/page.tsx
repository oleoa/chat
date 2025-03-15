import { createClient } from '@/supabase/server'
import Chat from '@/components/chat';
import { redirect } from 'next/navigation';
import { Conversation, Participant } from "@/interfaces"

export default async function Home() {

  const supabase = await createClient()

  const { data: user_data, error: user_error } = await supabase.auth.getUser()
  const user = user_data.user

  if (!user || user_error)
    redirect('/login')
  
  const res = await fetch(process.env.NEXT_PUBLIC_URL+"/api/conversations/"+user.id);
  if(!res.ok)
    console.error("Couldn't get the users conversations")

  const response = await res.json()
  const conversations: Conversation[] = response.data
  // console.log(conversations)

  return (
    <main>
      <Chat user_id={user.id} conversations={conversations} />
    </main>
  );
}
