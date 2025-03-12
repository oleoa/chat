"use client";

interface Props {
  conversation: {
    id: string,
    name: string,
    is_group: boolean
  },
  handleClick: Function,
  currentlyOpened: boolean
}

export default function Conversation({ conversation, handleClick, currentlyOpened }: Props) {
  return (
    <button onClick={() => handleClick(conversation.id)} className={'text-start p-4 relative flex gap-4 items-center hover:bg-gray-400 cursor-pointer border-y-1 '+(currentlyOpened ? "bg-gray-300" : "bg-gray-100")}>
      <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="Profile Image" className="rounded-full h-12" />
      <div className="flex flex-col">
        <h4>{conversation.is_group ? "Group" : "No Group"}</h4>
        <p>Last online at 12:47</p>
      </div>
    </button>
  );
}
