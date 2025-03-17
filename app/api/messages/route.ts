import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'
import { z } from "zod"

const messageSchema = z.object({
  sender_id: z.string().uuid(),
  conversation_id: z.number().int(),
  message: z.string().min(1, "The message needs to be at least 1 character long"),
})

export async function POST(req: Request) {
  const Response = new Res()
  const data = await req.json()

  try {
    const result = messageSchema.parse(data)

    const supabase = await createClient()
    const { data: message_data, error } = await supabase.from("messages").insert([
      { conversation_id: result.conversation_id, sender_id: result.sender_id, message: result.message }
    ]).select().single()
  
    if (error)
      return Response.server_error(error.message)
  
    if (!message_data)
      return Response.server_error("Message could not be retrieved")
  
    const newMessage = {
      id: message_data.id,
      message: message_data.message,
      conversation_id: message_data.conversation_id,
      sender_id: message_data.sender_id,
      created_at: message_data.created_at
    }

    const { error: conversation_update_error } = await supabase.from("conversations").update({ last_message: newMessage.id }).eq("id", newMessage.conversation_id)
    if (conversation_update_error)
      return Response.server_error(conversation_update_error.message)

    return Response.created(newMessage)
    
  } catch (error) {
    if (error instanceof z.ZodError){
      let errorMessage: string = ""
      error.errors.forEach(e => {
        errorMessage += e.message
      });
      return { success: false, message: errorMessage }
    }
    return { success: false, message: "Error" }
  }
}
