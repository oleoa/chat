/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";

import Keybar from "@/components/keybar";
import Messages from "@/components/messages";
import ProfileRow from "@/components/profileRow";

import { Conversation as ConversationInterface } from "@/interfaces";

interface Props {
  user_id: string;
  currentOpenedConversation: ConversationInterface | null;
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationInterface[]>
  >;
  conversations: ConversationInterface[];
}

export default function Conversation({
  user_id,
  currentOpenedConversation,
  setConversations,
  conversations,
}: Props) {
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scroll = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const newMessage = (message: string): void => {
    if (!currentOpenedConversation)
      return console.error(
        "Trying to create a message for a non opened conversation"
      );

    const newConversationsWithOptimisticMessage: ConversationInterface[] =
      conversations.map((conversation) => {
        if (conversation.id != currentOpenedConversation.id)
          return conversation;
        conversation.optimistic_messages = [
          ...conversation.optimistic_messages,
          {
            id: Math.random()
              .toString(36)
              .substring(2, 2 + 22),
            conversation_id: currentOpenedConversation.id,
            sender_id: user_id,
            message: message,
            created_at: "",
            from: null,
          },
        ];
        return conversation;
      });
    setConversations(newConversationsWithOptimisticMessage);

    fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        sender_id: user_id,
        conversation_id: currentOpenedConversation.id,
        message: message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((e) => console.error("Error creating the message: ", e))
      .then((res) => {
        if (!res) return console.error("Error creating the message");
        return res.json();
      });
  };

  // RESPONSIBLE FOR LOADING THE MESSAGES ONCE THE USER FIRST ENTERED THIS CONVO
  useEffect(() => {
    if (!currentOpenedConversation) return;

    if (
      currentOpenedConversation.messages &&
      currentOpenedConversation.messages.length > 0
    )
      return;

    setLoadingMessages(true);
    fetch("/api/messages/" + currentOpenedConversation.id)
      .catch((e) => console.error("Error at getting the messages: ", e))
      .then((res) => {
        if (!res) return console.error("Error at getting the messages");
        return res.json();
      })
      .then((response) => response.data)
      .then((messages) => {
        setConversations((conversations) => {
          const allConversations = [...conversations];
          allConversations[
            conversations.findIndex((c) => c.id == currentOpenedConversation.id)
          ].messages = messages;
          allConversations[
            conversations.findIndex((c) => c.id == currentOpenedConversation.id)
          ].optimistic_messages = [];
          return allConversations;
        });
      });
    setLoadingMessages(false);
  }, [currentOpenedConversation]);

  // RESPONSIBLE FOR SCROLLING DOWN WHEN MESSAGES OR FAKE MESSAGES IS UPDATED
  useEffect(() => {
    if (currentOpenedConversation && currentOpenedConversation.messages)
      scroll();
  }, [
    currentOpenedConversation?.messages,
    currentOpenedConversation?.optimistic_messages,
  ]);

  return (
    <div id="conversation" className="flex flex-col gap-2 relative">
      {currentOpenedConversation && (
        <ProfileRow
          conversation={currentOpenedConversation}
          profile={
            currentOpenedConversation.participants.filter(
              (participant) => participant.profile.user_id != user_id
            )[0].profile
          }
        />
      )}
      {currentOpenedConversation && (
        <Messages
          user_id={user_id}
          openedConversation={currentOpenedConversation}
          loadedOptimisitcMessages={
            currentOpenedConversation?.optimistic_messages
          }
          loadingMessages={loadingMessages}
        />
      )}
      {currentOpenedConversation && currentOpenedConversation.messages && (
        <span ref={messagesEndRef} />
      )}
      {currentOpenedConversation && <Keybar handleNewMessage={newMessage} />}
    </div>
  );
}
