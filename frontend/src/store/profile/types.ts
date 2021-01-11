import { Post } from '../social/types'

export type User = {
  userId: number
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  cca: UserCCA[]
  modules: string[]
  posts: Post[]
}

export type UserCCA = {
  userId: string
  ccaId: number
  ccaName: string
}

export enum PROFILE_ACTIONS {
  SET_USER_DETAILS = 'PROFILE_ACTIONS.SET_USER_DETAILS',
  EDIT_USER_DETAILS = 'PROFILE_ACTIONS.EDIT_USER_DETAILS',
}

type SetUserDetails = {
  type: typeof PROFILE_ACTIONS.SET_USER_DETAILS
  user: User
}

type EditUserDetails = {
  type: typeof PROFILE_ACTIONS.EDIT_USER_DETAILS
  newDisplayName: string
  newTelegramHandle: string
  newBio: string
  newCCA: UserCCA[]
  newModules: string[]
}

export type ActionTypes = SetUserDetails | EditUserDetails
