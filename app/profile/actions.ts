"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'

export async function update(formData: FormData) {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    redirect('/error')
  }

  const image = formData.get("image") as File
  let imageUrl = "https://zomigubbamglxoznxizr.supabase.co/storage/v1/object/public/";

  if(!image) return

  const { data: uploaded_image, error: error_uploading_image } = await supabase.storage.from('profile-picture').upload(user.id+"/pfp", image, { upsert: true })
  if(error_uploading_image)
    console.error(error_uploading_image)
  imageUrl += uploaded_image?.fullPath

  const profile_data = {
    name: formData.get('name') as string,
    username: formData.get('username') as string,
    bio: formData.get('bio') as string,
    image: imageUrl
  }

  const { error } = await supabase.from("profiles").update(profile_data).eq("user_id", user.id)

  if (error)
    console.error("Error at updating the user info ", error)

  revalidatePath('/', 'layout')
  redirect('/profile')
}
