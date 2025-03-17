export interface Profile {
  user_id: string,
  username: string,
  bio: string | null,
  name: string | null,
  image: string | null | undefined,
}

export interface Participant {
  profile: Profile
}

export interface Conversation {
  id: number
  name: string | null
  is_group: boolean
  participants: Participant[]
  last_message: LastMessage | null
}

export interface LastMessage {
  message: string
  sent_at: string
  from: LastMessageProfile
}

export interface LastMessageProfile {
  id: string
  username: string
  name: string | null
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

export interface FormState {
  message: string,
  success: boolean | null,
  error?: null | undefined | any
}
