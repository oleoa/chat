"use server";

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

  const profile_data = {
    name: formData.get('name') as string,
    username: formData.get('username') as string,
    bio: formData.get('bio') as string,
  }

  const { error } = await supabase
    .from("profiles")
    .update(profile_data)
    .eq("user_id", user.id)

  revalidatePath('/', 'layout')
  redirect('/profile')
}
