import { createClient } from '@/supabase/server'

export default async function Profile() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user
  
  return (
    <main>Profile of {user?.email}</main>
  )
}
