"use client";

import {
  Conversation as ConversationInterface,
  HandleClickFunction,
} from "@/interfaces";

interface Props {
  conversation: ConversationInterface;
  handleClick: HandleClickFunction;
  currentlyOpened: boolean;
  user_id: string;
  order: number;
}

export default function ConversationCard({
  conversation,
  handleClick,
  currentlyOpened,
  user_id,
  order,
}: Props) {
  const filtered_participants = conversation.participants.filter(
    (participant) => participant.profile.user_id != user_id
  );

  const name = conversation.is_group
    ? conversation.name
    : filtered_participants[0].profile.username;
  const image = conversation.is_group
    ? null
    : filtered_participants[0].profile.image;
  const lastMessage = conversation.last_message;

  return (
    <button
      style={{ order: order }}
      onClick={() => handleClick(conversation.id)}
      className={
        "text-start p-4 gap-4 grid grid-cols-3 items-center hover:bg-gray-400 cursor-pointer " +
        (currentlyOpened ? "bg-gray-300" : "bg-gray-100")
      }
    >
      <div className="h-16 w-16">
        <img
          src={
            image ??
            "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="Profile Image"
          className="pfp w-full h-full"
        />
      </div>
      <div className="hidden md:flex flex-col line-clamp-2 col-span-2">
        <h4>{name}</h4>
        <p className="truncate">
          {lastMessage && lastMessage.from
            ? (lastMessage.from.user_id == user_id
                ? "You"
                : lastMessage.from.username) +
              ": '" +
              lastMessage.message +
              "'"
            : "Start the convo"}
        </p>
      </div>
    </button>
  );
}
