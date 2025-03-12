'use server'

import { createClient } from '@/supabase/server'

export async function search(formData: FormData): Promise<any[]> {
  const supabase = await createClient()
  const search_username = formData.get("username") as string;
  const { data: searching_profile } = await supabase
    .from("profiles")
    .select()
    .textSearch("username", search_username)
  return searching_profile ?? [];
}
