/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'
import { z } from "zod"

const ProfileSchema = z.object({
  username: z.string().min(3, "The username must have at least 3 letters"),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  image: z.instanceof(File).nullable(),
})

import { FormState, Profile as ProfileInterface } from '@/interfaces'

export async function update(prevState: { message: string, success: boolean | null }, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    redirect('/error')
  }

  try {
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => { obj[key] = value });
    const results = ProfileSchema.parse(obj)

    const profile_data: ProfileInterface = {
      user_id: user.id,
      username: results.username,
      name: results.name,
      bio: results.bio,
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
  } catch(error) {
    if (error instanceof z.ZodError) {
      let errorMessage: string = ""
      error.errors.forEach(e => {
        errorMessage += e.message
      });
      return { success: false, message: errorMessage }
    }
    return { success: false, message: 'Error retrieving the user data' }
  }

}
