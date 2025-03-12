import Link from "next/link";
import { createClient } from '@/supabase/server'
import { signout } from '@/app/auth/actions'

export default async function Navbar() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user

  return (
    <nav>
      <Link className="text-3xl font-bold" href={"/"}>chat</Link>
      <div className="flex gap-4">
        {user && <Link className="btn bg-blue-600 text-white" href={"/profile"}>Profile</Link>}
        {!user && <Link href={"/login"} className="btn bg-green-600 text-white">Login</Link>}        
        {user && <form><button formAction={signout} className="btn bg-red-600 text-white">Sign Out</button></form>}
      </div>
    </nav>
  )
}
