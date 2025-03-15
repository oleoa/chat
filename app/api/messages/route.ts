import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'

export async function POST(req: Request) {
  const Response = new Res()
    
  try {
    const data = await req.json()

    if (!data)
      return Response.bad_request("No body found")

    if (!data.sender_id)
      return Response.bad_request("No 'sender_id' passed")

    if (!data.conversation_id)
      return Response.bad_request("No 'conversation_id' passed")

    if (!data.message)
      return Response.bad_request("No 'message' passed")
    
    const supabase = await createClient()

    const { data: message_data, error } = await supabase.from("messages").insert([
      { conversation_id: data.conversation_id, sender_id: data.sender_id, message: data.message }
    ]).select().single()

    if (error)
      return Response.server_error(error.message)

    if (!message_data)
      return Response.server_error("Message could not be retrieved")

    else {
      const newMessage = {
        id: message_data.id,
        message: message_data.message,
        conversation_id: message_data.conversation_id,
        sender_id: message_data.sender_id,
        created_at: message_data.created_at
      }
      return Response.created(newMessage)
    }

  } catch (error) {
    if(error)
      return Response.bad_request("Error retrieving the body")
  }
}
