import { createClient } from '@/supabase/server'
import Chat from '@/components/chat';
import { redirect } from 'next/navigation';

export default async function Home() {

  const supabase = await createClient()

  const { data: user_data, error: user_error } = await supabase.auth.getUser()
  const user = user_data.user

  if (!user)
    redirect('/login')

  const { data: conversations, error } = await supabase.rpc("get_user_conversations", { p_user_id: user.id });

  return (
    <main>
      <Chat user_id={user.id} conversations={conversations} />
    </main>
  );
}
