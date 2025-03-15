import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'

// Creates a new conversation
export async function POST(req: Request) {
  const Response = new Res()

  try {
    const data = await req.json()

    if (!data)
      return Response.bad_request("No 'user_id' passed")

    if (!data.from_user_id)
      return Response.bad_request("No 'from_user_id' passed")

    if (!data.to_user_id)
      return Response.bad_request("No 'to_user_id' passed")
    
    const supabase = await createClient()
    
    const { data: check_users_exists, error: error_check_users_exists } = await supabase.from("profiles").select().in("user_id", [data.from_user_id, data.to_user_id])
    if (error_check_users_exists)
      return Response.server_error(error_check_users_exists.message)

    if (!check_users_exists || check_users_exists.length != 2)
      return Response.bad_request("Not both users were found")
    
    const { data: new_conversation, error: new_conversation_error } = await supabase.from("conversations").insert([
      { created_by: data.from_user_id }
    ]).select().single()

    if (new_conversation_error)
      return Response.server_error(new_conversation_error.message)

    else {
      const newConversationId = new_conversation.id
      const { error: new_participants_error } = await supabase.from("participants").insert([
        { user_id: data.from_user_id, conversation_id: newConversationId },
        { user_id: data.to_user_id, conversation_id: newConversationId }
      ]).select()

      if (new_participants_error)
        return Response.server_error(new_participants_error.message)

      else {
        const { data: newConversations, error: newConversationsError } = await supabase.rpc("get_user_conversations", { p_user_id: data.from_user_id });
        if (newConversationsError)
          return Response.server_error(newConversationsError.message)
        else
          return Response.created(newConversations)
      }
    }
    
  } catch (error) {
    if(error)
      return Response.server_error("Error retrieving the body data")
  }
}
