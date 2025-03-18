/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";

import Search from "@/components/search";
import ConversationCard from "@/components/conversationCard";

import { Conversation as ConversationInterface } from "@/interfaces";

interface Props {
  user_id: string;
  currentConversationId: number | null;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  conversations: ConversationInterface[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationInterface[]>
  >;
}

export default function Sidebar({
  setCurrentConversationId,
  conversations,
  currentConversationId,
  user_id,
}: Props) {
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (!a.last_message || !b.last_message) return 0;
      return (
        new Date(b.last_message.created_at).getTime() -
        new Date(a.last_message.created_at).getTime()
      );
    });
  }, [conversations]);

  const newConversation = (new_user_id: string): void => {
    fetch("/api/conversations", {
      method: "POST",
      body: JSON.stringify({
        from_user_id: user_id,
        to_user_id: new_user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((e) => console.error(e))
      .then((res) => {
        if (!res) {
          console.error("Error at getting the conversations back");
        }
      });
  };

  const changeConversation = (id: number): void => {
    const conversationExists = conversations.find((c) => c.id == id) ?? false;
    if (!conversationExists)
      return console.error("Error finding the conversation");
    setCurrentConversationId(id);
  };

  return (
    <div id="sidebar">
      <Search handleNewConversation={newConversation} />
      <div className="flex flex-col border-b-2">
        {sortedConversations.map((conversation, index) => (
          <ConversationCard
            order={index}
            user_id={user_id}
            currentlyOpened={currentConversationId == conversation.id}
            handleClick={changeConversation}
            conversation={conversation}
            key={conversation.id}
          />
        ))}
      </div>
    </div>
  );
}
