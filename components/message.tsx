import { Message as MessageInterface } from "@/interfaces"

interface Props {
  message: MessageInterface,
  user_id: string,
  loading?: boolean,
  optmistic?: boolean
}

export default function Message({ message, user_id, loading = false, optmistic = false }: Props) {
  return (
    <div className={"flex "+(message.sender_id == user_id ? "justify-end " : "justify-start ")+(loading && "animate-pulse")}>
      <div className={"px-4 py-2 rounded-lg text-white "+(message.sender_id == user_id ? (optmistic ? "bg-green-500" : "bg-green-700") : "bg-gray-700")}>
        {message.message}
      </div>
    </div>
  )
}
