import { createClient } from '@/supabase/server'
import Chat from '@/components/chat';

export default async function Home() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user
  // console.log(user)

  const conversations = [
    { id: "1e111", name: "Leonardo" },
    { id: "2e222", name: "Afonso" },
    { id: "3e333", name: "Isabela" }
  ]

  const messages = [
    {
      id: "0",
      conversation_id: "1e111",
      sender_id: "8eb33822-d73d-48a5-997e-7c244946de3b",
      message: "Hello",
      created_at: 1741794401
    },
    {
      id: "1",
      conversation_id: "1e111",
      sender_id: "8eb33822-d73d-48a5-997e-7c244946de3a",
      message: "World",
      created_at: 1741794402
    },
    {
      id: "3",
      conversation_id: "2e222",
      sender_id: "8eb33822-d73d-48a5-997e-7c244946de3b",
      message: "Hello, how are you doing?",
      created_at: 1741794402
    },
  ]

  return (
    <main>
      <Chat user_id={user?.id ?? ""} conversations={conversations} messages={messages} />
    </main>
  );
}
