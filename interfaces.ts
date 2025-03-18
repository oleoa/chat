export interface Conversation {
  id: number
  name: string | null
  is_group: boolean
  participants: Participant[]
  messages: Message[]
  optimistic_messages: Message[]
  last_message: Message | null
}

export interface Participant {
  profile: Profile
}

export interface Profile {
  user_id: string
  username: string
  bio: string | null
  name: string | null
  image: string | null | undefined
}

export interface Message {
  id: string
  conversation_id: number
  sender_id: string
  message: string
  created_at: string
  from: Profile | null
}

export interface FormState {
  message: string
  success: boolean | null
  error?: null | undefined | any
}

export interface HandleNewConversation { (user_id: string): void }
export interface HandleClickFunction { (conversation_id: number): void }
