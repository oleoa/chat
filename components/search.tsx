"use client";

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
    const username = formData.get("username")
    const res = await fetch("/api/profile/username/"+username)
    if (!res.ok) {
      setMessage("Username not found")
      console.error(await res.json())
    }
    else {
      const response = await res.json()
      handleNewConversation(response.data.user_id)
    }
  }

  return (
    <div className='p-4 relative border-b-1 hidden md:flex'>
      <form action={handleSearch}>
        <input type="text" name='username' placeholder="Search for a username"/>
        {message}
      </form>
    </div>
  );
}
