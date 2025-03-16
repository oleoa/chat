'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'

import { FormState } from '@/interfaces';

export async function login(prevState: { message: string, success: boolean | null }, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error)
    return { message: "Wrong credentials or user not found", success: false }

  revalidatePath('/')
  redirect('/')
}

export async function signup(prevState: { message: string, success: boolean | null }, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const signin_data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signUp(signin_data)
  if (error || !data || !data.user)
    return { message: "Error at signing you up", success: false }

  const user_id = data.user.id
  const { error: profiles_error } = await supabase.from('profiles').insert({ user_id: user_id })
  if (profiles_error)
    return { message: "Error at creating your profile", success: false }

  revalidatePath('/')
  redirect('/profile')
}

export async function signout() {

  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error)
    return { message: "Error at signing you out", success: false }

  revalidatePath('/')
  redirect('/')
}
