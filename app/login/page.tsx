import { login, signup } from '@/app/auth/actions'
import LoginForm from '@/components/loginForm'

export default function LoginPage() {
  return (
    <main>
      <h1 className='text-4xl text-center py-4'>Login</h1>
      <LoginForm />
    </main>
  )
}
