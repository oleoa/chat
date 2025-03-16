"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'

import { FormState, Profile as ProfileInterface } from '@/interfaces';

export async function update(prevState: { message: string, success: boolean | null }, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    redirect('/error')
  }

  const username = formData.get('username') as string
  if(!username)
    return { success: false, message: 'Please provide an username' }

  const profile_data: ProfileInterface = {
    user_id: user.id,
    username: formData.get('username') as string,
    name: formData.get('name') as string,
    bio: formData.get('bio') as string,
    image: undefined
  }

  const image = formData.get("image") as File
  if (image.size > 0) {
    let imageUrl = "https://zomigubbamglxoznxizr.supabase.co/storage/v1/object/public/"
    const { data: uploaded_image, error: error_uploading_image } = await supabase.storage.from('profile-picture').upload(user.id+"/pfp", image, { upsert: true })
    if(error_uploading_image)
      return { message: "Error uploading the image", success: false }
    imageUrl += uploaded_image?.fullPath
    profile_data.image = imageUrl
  }

  const { error } = await supabase.from("profiles").update(profile_data).eq("user_id", user.id)

  if (error)
    return { success: false, message: 'Error updating the user' }

  revalidatePath('/profile')
  return { success: true, message: 'User data updated' }
}
