export interface Profile {
  user_id: string,
  username: string,
  bio: string | null,
  name: string | null,
  image: string | null,
}

export interface Participant {
  profile: Profile
}

export interface Conversation {
  id: number,
  name: string | null,
  is_group: boolean,
  participants: Participant[]
}

export interface Message {
  id: string,
  conversation_id: string,
  sender_id: string,
  message: string,
  created_at: string
}

export interface HandleNewConversation { (user_id: string): void }
export interface HandleClickFunction { (conversation_id: number): void }
