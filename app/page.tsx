import { createClient } from '@/supabase/server'
import Chat from '@/components/chat';
import { redirect } from 'next/navigation';

export default async function Home() {

  const supabase = await createClient()

  const { data: user_data, error: user_error } = await supabase.auth.getUser()
  const user = user_data.user

  if (!user || user_error)
    redirect('/login')

  const { data: conversations, error } = await supabase.rpc("get_user_conversations", { p_user_id: user.id });
  if (error)
    console.error("Error getting the conversations at main page: ", error)

  return (
    <main>
      <Chat user_id={user.id} conversations={conversations} />
    </main>
  );
}
