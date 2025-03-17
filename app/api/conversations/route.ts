import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'
import { z } from "zod"

const conversationSchema = z.object({
  from_user_id: z.string().uuid(),
  to_user_id: z.string().uuid(),
})

// Creates a new conversation
export async function POST(req: Request) {
  const Response = new Res()
  const data = await req.json()

  try {
    const results = conversationSchema.parse(data)

    const supabase = await createClient()
    const { data: check_users_exists, error: error_check_users_exists } = await supabase.from("profiles").select().in("user_id", [results.from_user_id, results.to_user_id])
    if (error_check_users_exists)
      return Response.server_error(error_check_users_exists.message)

    if (!check_users_exists || check_users_exists.length != 2)
      return Response.bad_request("Not both users were found")
    
    const { data: new_conversation, error: new_conversation_error } = await supabase.from("conversations").insert([
      { created_by: results.from_user_id }
    ]).select().single()

    if (new_conversation_error)
      return Response.server_error(new_conversation_error.message)

    else {
      const newConversationId = new_conversation.id
      const { error: new_participants_error } = await supabase.from("participants").insert([
        { user_id: results.from_user_id, conversation_id: newConversationId },
        { user_id: results.to_user_id, conversation_id: newConversationId }
      ]).select()

      if (new_participants_error)
        return Response.server_error(new_participants_error.message)

      if(new_conversation)
        return Response.created(new_conversation.id)
    }
    
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.bad_request("Error at parsing the received form data")
  }
}
