'use client'

import { useActionState } from "react";
import { update } from "@/app/profile/actions"

import { Profile as ProfileInterface, FormState } from '@/interfaces';
import UpdateButton from "./updateButton";
import ActionState from "../actionState";
interface Props {
  profile: ProfileInterface
}

const initialState: FormState = {
  message: '',
  success: null,
}

export default function UpdateForm({ profile }: Props) {

  const [state, formAction, pending] = useActionState<FormState, FormData>(update, initialState)

  return (
    <form action={formAction} className='border-2 rounded-lg p-4'>
      <div className='flex gap-4 justify-center items-center'>
        <label htmlFor="fileField">
          <img src={profile.image ?? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="User Image" className='rounded-full h-24 w-24 cursor-pointer' />
        </label>
        <input type="file" id="fileField" name="image" accept="image/*" className='hidden'/>
        <div className='flex flex-col gap-4'>
          <input type="text" name="name" defaultValue={profile.name ?? ""} placeholder="Name" className='h-fit'/>
          <input type="text" name="username" defaultValue={profile.username ?? ""} placeholder="Username" className='h-fit'/>
        </div>
      </div>
      <textarea name="bio" placeholder='Bio' defaultValue={profile.bio ?? ""}></textarea>
      <UpdateButton isLoading={pending} />
      <ActionState state={state} />
    </form>
  )
}
