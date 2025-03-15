"use client";

import { Conversation as ConversationInterface, HandleClickFunction } from '@/interfaces';

interface Props {
  conversation: ConversationInterface,
  handleClick: HandleClickFunction,
  currentlyOpened: boolean,
  user_id: string
}

export default function Conversation({ conversation, handleClick, currentlyOpened, user_id }: Props) {
  const filtered_participants = conversation.participants.filter((participant) => participant.profile.user_id != user_id)
  const name = conversation.is_group ? conversation.name : filtered_participants[0].profile.username
  const image = conversation.is_group ? null : filtered_participants[0].profile.image
  return (
    <button onClick={() => handleClick(conversation.id)} className={'text-start p-4 relative flex gap-4 items-center hover:bg-gray-400 cursor-pointer border-y-1 '+(currentlyOpened ? "bg-gray-300" : "bg-gray-100")}>
      <img src={image ?? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="Profile Image" className="rounded-full h-16 w-16" />
      <div className="hidden md:flex flex-col">
        <h4>{name}</h4>
        <p>Online at 12:47</p>
      </div>
    </button>
  )
}
