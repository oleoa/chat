'use client'

import { useActionState } from "react";
import { login, signup } from '@/app/auth/actions'

import { FormState } from '@/interfaces';
import ActionState from "../../components/actionState";

const initialState: FormState = {
  message: '',
  success: null,
}

export default function Form() {

  const [loginState, loginAction, loginPending] = useActionState<FormState, FormData>(login, initialState)
  const [signupState, signupAction, signupPending] = useActionState<FormState, FormData>(signup, initialState)

  return (
    <form className='w-1/3 p-4 border-2 rounded-lg'>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <div className='flex gap-4 w-full'>
        {!signupPending && <button disabled={loginPending} className={"btn transition-all duration-300 text-white w-full "+(loginPending ? "bg-green-800" : "bg-green-500")} formAction={loginAction}>{loginPending ? "Loging you in..." : "Log in"}</button>}
        {!loginPending && <button disabled={signupPending} className={"btn transition-all duration-300 border-2 w-full "+(signupPending ? "border-green-800 text-green-800" : "border-green-500 text-green-500")} formAction={signupAction}>{signupPending ? "Signing you up..." : "Sign up"}</button>}
      </div>
      <ActionState state={loginState} />
      <ActionState state={signupState} />
    </form>
  )
}
