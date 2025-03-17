import { createClient } from '@/supabase/server'
import Res from '@/app/api/responses'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {

  const Response = new Res()

  const { slug } = await params

  const action = slug[0]
  const possible_actions = ["username", "user_id"]
  if(!action || !possible_actions.includes(action))
    return Response.bad_request("Please provide a method of search ["+possible_actions.join(", ")+"]")
  
  if(action == "username")
  {
    const username = slug[1]
    if(!username)
      return Response.bad_request("Please provide a username of search")
    
    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").select().eq("username", username).single()
    if (!data || error)
      return Response.server_error("Username '"+username+"' not found")
    return Response.success(data)
  }

  if(action == "user_id")
  {
    const user_id = slug[1]
    if(!user_id)
      return Response.bad_request("Please provide a user_id of search")
    
    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").select().eq("user_id", user_id).single()
    if (!data || error)
      return Response.bad_request("User with user_id '"+user_id+"' not found")
    return Response.success(data)
  }
}
