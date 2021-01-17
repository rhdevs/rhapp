import { Post } from '../social/types'

export type User = {
  userID: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  ccas: UserCCA[]
  modules: string[]
  posts: Post[]
  friends: Friend[]
}

export type Friend = {
  friendId: number
  name: string
  telegram: string
  avatar?: string
}

export type UserCCA = {
  userId: string
  ccaId: number
  ccaName: string
}

export enum PROFILE_ACTIONS {
  SET_USER_DETAILS = 'PROFILE_ACTIONS.SET_USER_DETAILS',
  EDIT_USER_DETAILS = 'PROFILE_ACTIONS.EDIT_USER_DETAILS',
  UPDATE_CURRENT_USER = 'PROFILE_ACTIONS.UPDATE_CURRENT_USER',
  UPDATE_USER_MODULES = 'PROFILE_ACTIONS.UPDATE_USER_MODULES',
  UPDATE_USER_CCAS = 'PROFILE_ACTIONS.UPDATE_USER_CCAS',
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
  newCCAs: UserCCA[]
  newModules: string[]
}

type UpdateCurrentUser = {
  type: typeof PROFILE_ACTIONS.UPDATE_CURRENT_USER
  user: User
}

type UpdateUserModules = {
  type: typeof PROFILE_ACTIONS.UPDATE_USER_MODULES
  newModules: string[]
}

type UpdateUserCcas = {
  type: typeof PROFILE_ACTIONS.UPDATE_USER_CCAS
  newCcas: UserCCA[]
}

export type ActionTypes = SetUserDetails | EditUserDetails | UpdateCurrentUser | UpdateUserModules | UpdateUserCcas
