import { Profile as ProfileInterface } from "@/interfaces"

interface Props {
  profile: ProfileInterface
}

export default function Profile({ profile }: Props) {
  return (
    <div className='flex flex-row gap-4 justify-start items-center border-2 p-4 rounded-lg bg-white'>
      <img src={profile.image ?? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="User Image" className='pfp h-64 w-64' />
      <div className="flex flex-col gap-4">
        {profile.name ? (<p className='flex gap-4 items-center'>Name:<span className='px-4 py-2 border-2 rounded-lg'>{profile.name}</span></p>) : (<p className='flex gap-4 items-center px-4 py-2 rounded-lg border-2'>No name</p>)}
        {profile.username ? (<p className='flex gap-4 items-center'>Username:<span className='px-4 py-2 border-2 rounded-lg'>{profile.username}</span></p>) : (<p className='flex gap-4 items-center px-4 py-2 rounded-lg border-2'>No username</p>)}
        {profile.bio ? (<p className='flex w-fit gap-4 items-center'>Bio:<span className='px-4 py-2 border-2 rounded-lg'>{profile.bio}</span></p>) : <p className='flex w-full gap-4 justify-center items-center px-4 py-2 rounded-lg border-2'>No Bio</p>}
      </div>
    </div>
  )
}
