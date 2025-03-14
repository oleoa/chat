'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const signin_data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signUp(signin_data)
  
  if (error) {
    redirect('/error')
  }

  const user_id = data.user?.id ?? ""
  async function createProfile(user_id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').insert({ user_id: user_id })
    if (error) {
      redirect('/error')
    }
  }
  createProfile(user_id)

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function signout() {

  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
