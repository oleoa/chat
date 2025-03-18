import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'

// Get all Conversations from the user
// Pass the user_id in the URL
// TODO VERIFY IF THE USER IS THE ONE SENDING THE REQUEST
export async function GET(req: Request, { params }: { params: Promise<{ user_id: string }> }) {
  const Response = new Res()

  const { user_id } = await params
  if (!user_id)
    return Response.bad_request("No 'user_id' passed")

  const supabase = await createClient()
  const { data, error } = await supabase
  .from("participants")
  .select(`
    conversation: conversations (
      id,
      is_group,
      name,
      last_message (
        id,
        conversation_id,
        sender_id,
        message,
        created_at,
        from: profiles (
          user_id,
          username,
          name,
          bio,
          image
        )
      ),
      participants (
        profile: profiles (
          user_id,
          name,
          username,
          image
        )
      )
    )
  `)
  .eq("user_id", user_id);

  if(error)
    return Response.server_error(error.message)

  const conversations = data.map((box) => box.conversation)
  return Response.success(conversations)
}
