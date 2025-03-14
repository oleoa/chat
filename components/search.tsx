"use client";

import { search } from "@/app/conversations/actions"
import { useState } from "react";

interface Props {
  handleNewConversation: HandleNewConversation
}

interface HandleNewConversation {
  (user_id: string): void
}

export default function Search({ handleNewConversation }: Props) {

  const [message, setMessage] = useState("")

  async function handleSearch(formData: FormData) {
    const res = await search(formData)
    if (!res || res.length == 0)
      setMessage("Username not found")
    else
      handleNewConversation(res[0].user_id)
  }

  return (
    <div className='p-4 relative border-b-1'>
      <form action={handleSearch}>
        <input type="text" name='username' placeholder="Search for a username"/>
        {message}
      </form>
    </div>
  );
}
