import { createClient } from '@/supabase/server'
import { update } from "./actions"

export default async function Profile() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", user?.id)
    .single()
  
  return (
    <main>
      <h1 className='flex gap-4'>Profile</h1>
      <form className='border-2 rounded-lg p-4'>
        <div className='flex gap-4 justify-center items-center'>
          <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="User Image" className='rounded-full h-24' />
          <div className='flex flex-col gap-4'>
            <input type="text" name="name" defaultValue={profile.name} placeholder="Name" className='h-fit'/>
            <input type="text" name="username" defaultValue={profile.username} placeholder="Username" className='h-fit'/>
          </div>
        </div>
        <textarea name="bio" placeholder='Bio' defaultValue={profile.bio}></textarea>
        <button className='btn bg-green-500 text-white' formAction={update}>Update</button>
      </form>
    </main>
  )
}
