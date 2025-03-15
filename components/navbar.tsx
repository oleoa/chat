import Link from "next/link";
import { createClient } from '@/supabase/server'
import { signout } from '@/app/auth/actions'

export default async function Navbar() {

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  return (
    <nav>
      <div id={user ? "logo" : "logo-anonymous"}>
        <Link className="text-xl md:text-3xl font-bold" href={"/"}>chat</Link>
      </div>
      <div className="flex gap-4">
        {user && <Link className="btn bg-blue-600 text-white" href={"/profile"}>Profile</Link>}
        {user && <form><button formAction={signout} className="btn bg-red-600 text-white">Sign Out</button></form>}
      </div>
    </nav>
  )
}
