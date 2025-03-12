import { login, signup } from '@/app/auth/actions'

export default function LoginPage() {
  return (
    <main>
      <h1 className='text-4xl text-center'>Login</h1>
      <form className='w-1/3 p-4 border-2 rounded-lg'>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <div className='flex gap-4 w-full'>
          <button className="btn bg-green-500 text-white w-full" formAction={login}>Log in</button>
          <button className="btn border-2 border-green-500 text-green-500 w-full" formAction={signup}>Sign up</button>
        </div>
      </form>
    </main>
  )
}
