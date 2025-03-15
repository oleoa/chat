import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'

// Get all messages from a conversation
// Pass the conversation_id in the URL
// TODO: VERIFY IF THE USER IS IN THE CONVERSATIONS
export async function GET(req: Request, { params }: { params: Promise<{ conversation_id: string }> }) {
  const Response = new Res()

  const { conversation_id } = await params
  if (!conversation_id)
    return Response.bad_request("No 'conversation_id' passed")

  const supabase = await createClient()
  const { data: messages, error } = await supabase.from("messages").select().eq("conversation_id", conversation_id)
  if (error)
    return Response.server_error(error.message)
  return Response.success(messages)
}
