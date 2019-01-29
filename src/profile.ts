interface UserInfoRaw {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
}

export interface Profile {
  _raw?: string
  _json?: UserInfoRaw
  id?: string
  displayName?: string
  emails?: { value: string }[]
  photos?: { value: string }[]
  provider?: string
  username?: string
}

export function parseUserProfile(userInfo: UserInfoRaw) {
  const profile: Profile = {}
  profile.id = userInfo.id
  profile.displayName = userInfo.full_name
  if (userInfo.email) {
    profile.emails = [{ value: userInfo.email }]
  }
  if (userInfo.avatar_url) {
    profile.photos = [{ value: userInfo.avatar_url }]
  }
  return profile
}
