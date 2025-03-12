"use client"

interface Props {
  handleNewMessage: Function
}

export default function Keybar({ handleNewMessage }: Props) {

  async function handleAction(formData: FormData) {
    const message = formData.get("message")
    handleNewMessage(message)
  }

  return (
    <div className="absolute bottom-0 p-4 pr-12 flex w-full">
      <form action={handleAction} className="w-full">
        <input type="text" className="w-full" name="message" />
      </form>
    </div>
  )
}
