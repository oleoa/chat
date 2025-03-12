"use client";

import { search } from "@/app/conversations/actions"
import { useState } from "react";

export default function Search() {

  const [searchString, setSearch] = useState("")
  const [results, setResults] = useState<any[]>([])

  async function handleSearch(formData: FormData) {
    const res = await search(formData)
    setResults(res)
  }

  return (
    <div className='p-4 relative border-b-1'>
      <form action={handleSearch}>
        <input type="text" name='username' value={searchString} onChange={(e) => setSearch((s) => e.target.value)}/>
      </form>
    </div>
  );
}
