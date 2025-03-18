'use client'

import Link from "next/link"
import ProfileCard from "@/components/profile"
import { Profile, Conversation as ConversationInterface } from "@/interfaces"
import { useEffect, useState } from "react"

interface Props {
  profile: Profile
  conversation: ConversationInterface
}

export default function ProfileRow({ profile, conversation }: Props) {

  const [showingProfile, setShowingProfile] = useState(false)
  const toggleShowingProfile = () => {setShowingProfile((s) => !s)}

  useEffect(() => {
    setShowingProfile(false)
  }, [profile])

  return (
    <>
      {conversation.is_group ? (
        <div id="profile-row">
          <Link className="flex items-center justify-center w-fit gap-4" href={"/group/"+conversation.id}>
            <img className="pfp h-12 w-12" src={profile.image ?? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="Profile Image" />
            <div>
              <h5>{conversation.name}</h5>
              <p className="flex gap-4">{conversation.participants.map((p) => p.profile.username).join(", ")}</p>
            </div>
          </Link>
        </div>
      ) : (
        <div id="profile-row">
          <button className="flex items-center justify-center w-fit gap-4" onClick={toggleShowingProfile}>
            <img className="pfp h-12 w-12" src={profile.image ?? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="Profile Image" />
            <div>
              <h5 className="flex justify-start">{profile.name}</h5>
              <p className="flex justify-start">{profile.username}</p>
            </div>
          </button>
          {showingProfile && <ProfileCard profile={profile} />}
        </div>
      )}
    </>
  )
}
