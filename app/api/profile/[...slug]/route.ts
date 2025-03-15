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

export async function POST(req: Request) {
  
  const Response = new Res()
  const data = await req.json()

  if(!data)
    return Response.bad_request("No body passed")

  if(!data.name)
    return Response.bad_request("No 'name' passed")

  if(!data.username)
    return Response.bad_request("No 'username' passed")

  if(!data.bio)
    return Response.bad_request("No 'bio' passed")

  if(!data.image)
    return Response.bad_request("No 'image' passed")
  
  const supabase = await createClient()
  const { data: user_data } = await supabase.auth.getUser()
  const user = user_data.user
  
  if (!user)
    return Response.bad_request("Not auth")

  const image = data.image as File
  let imageUrl = "https://zomigubbamglxoznxizr.supabase.co/storage/v1/object/public/";

  if(!image)
    return

  const { data: uploaded_image, error: error_uploading_image } = await supabase.storage.from('profile-picture').upload(user.id+"/pfp", image, { upsert: true })
  if(error_uploading_image)
    console.error(error_uploading_image)
  imageUrl += uploaded_image?.fullPath

  const profile_data = {
    name: data.name as string,
    username: data.username as string,
    bio: data.bio as string,
    image: imageUrl
  }

  const { error } = await supabase.from("profiles").update(profile_data).eq("user_id", user.id)

  if (error)
    return Response.server_error(error.message)
  return Response.success("Profile updated successfully")
}
