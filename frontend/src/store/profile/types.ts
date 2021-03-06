export type User = {
  _id: string
  userID: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  modules: string[]
  position: Position[]
}

export type Position = {
  ccaID: number
  name: string
}

export type Friend = {
  friendId: number
  name: string
  telegram: string
  avatar?: string
}

export type UserCCA = {
  userID: string
  ccaID: number
  ccaName: string
}

export type Post = {
  _id: string
  userID: string
  title: string
  description: string
  ccaID: number
  createdAt: number
  postPics: string[]
  isOfficial: boolean
  tags: string[]
}

export enum PROFILE_ACTIONS {
  SET_USER_DETAILS = 'PROFILE_ACTIONS.SET_USER_DETAILS',
  SET_USER_CCAS = 'PROFILE_ACTIONS.SET_USER_CCAS',
  SET_ALL_CCAS = 'PROFILE_ACTIONS.SET_ALL_CCAS',
  SET_USER_FRIENDS = 'PROFILE_ACTIONS.SET_USER_FRIENDS',
  EDIT_USER_DETAILS = 'PROFILE_ACTIONS.EDIT_USER_DETAILS',
  UPDATE_CURRENT_USER = 'PROFILE_ACTIONS.UPDATE_CURRENT_USER',
  UPDATE_USER_MODULES = 'PROFILE_ACTIONS.UPDATE_USER_MODULES',
  UPDATE_USER_CCAS = 'PROFILE_ACTIONS.UPDATE_USER_CCAS',
  SET_IS_LOGGED_IN = 'PROFILE_ACTIONS.SET_IS_LOGGED_IN',
  SET_USER_POSTS = 'PROFILE_ACTIONS.SET_USER_POSTS',
}

type SetIsLoggedIn = {
  type: typeof PROFILE_ACTIONS.SET_IS_LOGGED_IN
  isLoggedIn: boolean | null
}

type SetUserDetails = {
  type: typeof PROFILE_ACTIONS.SET_USER_DETAILS
  user: User
}

type SetUserCcas = {
  type: typeof PROFILE_ACTIONS.SET_USER_CCAS
  ccas: UserCCA[]
}

type SetAllCcas = {
  type: typeof PROFILE_ACTIONS.SET_ALL_CCAS
  allCcas: UserCCA[]
}

type SetUserFriends = {
  type: typeof PROFILE_ACTIONS.SET_USER_FRIENDS
  friends: User[]
}

type SetUserPosts = {
  type: typeof PROFILE_ACTIONS.SET_USER_POSTS
  posts: Post[]
}

type EditUserDetails = {
  type: typeof PROFILE_ACTIONS.EDIT_USER_DETAILS
  newDisplayName: string
  newTelegramHandle: string
  newBio: string
  newCCAs: UserCCA[]
  newModules: string[]
}

type UpdateCurrentUser = {
  type: typeof PROFILE_ACTIONS.UPDATE_CURRENT_USER
  user: User
  ccas: UserCCA[]
}

type UpdateUserModules = {
  type: typeof PROFILE_ACTIONS.UPDATE_USER_MODULES
  newModules: string[]
}

type UpdateUserCcas = {
  type: typeof PROFILE_ACTIONS.UPDATE_USER_CCAS
  newCCAs: UserCCA[]
}

export type ActionTypes =
  | SetUserDetails
  | EditUserDetails
  | UpdateCurrentUser
  | UpdateUserModules
  | UpdateUserCcas
  | SetUserCcas
  | SetUserFriends
  | SetAllCcas
  | SetIsLoggedIn
  | SetUserPosts
