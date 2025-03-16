'use client'

interface Props {
  isLoading: boolean
}

export default function UpdateButton({ isLoading }: Props) {
  return (
    <button className={'btn text-white '+(isLoading ? 'bg-green-800' : 'bg-green-500')}>{isLoading ? "Loading..." : "Update"}</button>
  )
}
