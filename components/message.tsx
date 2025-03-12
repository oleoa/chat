interface Props {
  message: {
    id: string,
    conversation_id: string,
    sender_id: string,
    message: string,
    created_at: number
  },
  user_id: string
}

export default function Message({ message, user_id }: Props) {
  return (
    <div className={"flex "+(message.sender_id == user_id ? "justify-end " : "justify-start ")}>
      <div className={"px-4 py-2 rounded-lg text-white "+(message.sender_id == user_id ? "bg-green-700 " : "bg-gray-700 ")}>
        {message.message}
      </div>
    </div>
  )
}
