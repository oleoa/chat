import UpdateForm from '@/components/profile/updateForm'
import ServerError from '@/components/serverError'
import { createClient } from '@/supabase/server'

export default async function Profile() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error)
    return <ServerError message={"Error at getting the logged user data: "+error.message} />
  
  const user = data.user
  const { data: profile, error: profile_error } = await supabase.from("profiles").select().eq("user_id", user?.id).single()
  if (profile_error)
    return <ServerError message={"Error at getting the logged user information: "+profile_error.message} />
  
  return (
    <main>
      <h1 className='flex gap-4 py-4'>{profile.username ? "Profile of "+profile.username : "Set up your profile!"}</h1>
      <UpdateForm profile={profile} />
    </main>
  )
}
